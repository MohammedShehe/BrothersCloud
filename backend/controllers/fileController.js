// controllers/fileController.js
const FileModel = require('../models/fileModel');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const mime = require('mime-types');
const path = require('path');
const axios = require('axios');

// 🔹 Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ===========================
   Helpers
=========================== */
function getResourceType(mime_type, file_type) {
  const mt = (mime_type || '').toLowerCase();
  const ft = (file_type || '').toLowerCase();

  if (ft === 'image') return 'image';
  if (ft === 'video') return 'video';

  // Docs & PDFs → raw
  if (
    mt === 'application/pdf' ||
    mt.includes('msword') ||
    mt.includes('officedocument') ||
    mt.includes('excel') ||
    mt.includes('powerpoint') ||
    mt === 'text/plain' ||
    mt === 'application/zip' ||
    ft === 'document'
  ) {
    return 'raw';
  }

  return 'raw';
}

function safeAttachmentName(name = 'file') {
  const base = path.basename(name).replace(/[^\w.\-()\s]/g, '_');
  return base || 'file';
}

function buildViewUrl(file) {
  const { cloud_id, cloudinary_url, file_type, mime_type } = file;
  const mt = mime_type || 'application/octet-stream';
  const resource_type = getResourceType(mt, file_type);

  if (cloud_id) {
    return cloudinary.url(cloud_id, {
      resource_type,
      type: 'upload',
      secure: true,
    });
  }

  return cloudinary_url;
}

function buildDownloadUrl(file) {
  const { cloud_id, file_type, mime_type, file_name } = file;
  const mt = mime_type || mime.lookup(file_name) || 'application/octet-stream';
  const resource_type = getResourceType(mt, file_type);
  const attachmentName = safeAttachmentName(file_name);

  if (cloud_id) {
    return cloudinary.url(cloud_id, {
      resource_type,
      type: 'upload',
      flags: 'attachment',
      attachment: attachmentName,
      secure: true,
    });
  }

  return null;
}

/* ===========================
   Upload
=========================== */
exports.uploadFile = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const file_type = (req.body.file_type || '').trim().toLowerCase();
    const file_name = req.body.file_name;
    const file_description = req.body.file_description || '';

    if (!file_type || !file_name) {
      return res.status(400).json({ message: 'file_type and file_name are required' });
    }
    if (!req.file && file_type !== 'event') {
      return res.status(400).json({ message: 'File is required' });
    }

    let file_url = null, public_id = null, file_size = null, mime_type = null;

    if (req.file && file_type !== 'event') {
      mime_type = req.file.mimetype || mime.lookup(file_name) || 'application/octet-stream';
      const resource_type = getResourceType(mime_type, file_type);

      const folder =
        file_type === 'image'
          ? 'brotherscloud/images'
          : file_type === 'document'
          ? 'brotherscloud/documents'
          : file_type === 'video'
          ? 'brotherscloud/videos'
          : 'brotherscloud/raw';

      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder,
        resource_type,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        access_mode: 'public',
      });

      file_url = uploadResult.secure_url;
      public_id = uploadResult.public_id;
      file_size = req.file.size;

      fs.unlink(req.file.path, () => {});
    }

    const id = await FileModel.create({
      user_id,
      file_type,
      file_name,
      file_description,
      file_path: null,
      file_size,
      cloud_id: public_id,
      cloudinary_url: file_url,
      mime_type,
    });

    const newFile = await FileModel.getById(id);
    const viewUrl = buildViewUrl(newFile);
    const downloadUrl = newFile.cloud_id ? buildDownloadUrl(newFile) : null;

    return res.status(201).json({
      message: 'File uploaded successfully',
      file: { ...newFile, cloudinary_url: viewUrl, view_url: viewUrl, download_url: downloadUrl },
    });
  } catch (err) {
    console.error('[Upload Error]', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* ===========================
   List / Get
=========================== */
exports.getFiles = async (req, res) => {
  try {
    const files = await FileModel.getAll(req.query);

    const normalized = files.map((f) => {
      const view = buildViewUrl(f);
      const dl = f.cloud_id ? buildDownloadUrl(f) : null;
      return { ...f, cloudinary_url: view, view_url: view, download_url: dl };
    });

    return res.json(normalized);
  } catch (err) {
    console.error('[Get Files Error]', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getFileById = async (req, res) => {
  try {
    const file = await FileModel.getById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    const view = buildViewUrl(file);
    const dl = file.cloud_id ? buildDownloadUrl(file) : null;

    return res.json({ ...file, cloudinary_url: view, view_url: view, download_url: dl });
  } catch (err) {
    console.error('[Get File Error]', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* ===========================
   View
=========================== */
exports.viewFile = async (req, res) => {
  try {
    const file = await FileModel.getById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    const viewUrl = buildViewUrl(file);
    if (!viewUrl) return res.status(400).json({ message: 'This file has no content' });

    const mt = file.mime_type || mime.lookup(file.file_name) || 'application/octet-stream';
    const ext = path.extname(file.file_name || '').toLowerCase();

    // PDFs → stream inline
    if (mt === 'application/pdf' || ext === '.pdf') {
      try {
        const response = await axios.get(viewUrl, { responseType: 'stream' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${safeAttachmentName(file.file_name)}"`);
        response.data.pipe(res);
        return;
      } catch (err) {
        console.error('[PDF Stream Error]', err);
        return res.redirect(viewUrl);
      }
    }

    // Office docs → Google Docs Viewer with download button
    if (['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx'].includes(ext)) {
      const gviewUrl = `https://docs.google.com/gview?url=${encodeURIComponent(viewUrl)}&embedded=true`;
      const downloadUrl = file.cloud_id ? buildDownloadUrl(file) : viewUrl;

      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Preview: ${file.file_name}</title>
          <meta name="referrer" content="no-referrer" />
          <style>
            html,body { margin:0; padding:0; height:100%; }
            body { display:flex; flex-direction:column; }
            .topbar { background:#222; padding:10px; display:flex; justify-content:space-between; align-items:center; }
            .topbar a { background:#4CAF50; color:#fff; padding:8px 12px; text-decoration:none; border-radius:6px; }
            .topbar span { color:#fff; font-weight:bold; }
            iframe { flex:1; border:none; width:100%; }
          </style>
        </head>
        <body>
          <div class="topbar">
            <span>${file.file_name}</span>
            <a href="${downloadUrl}" target="_blank" rel="noopener">⬇ Download</a>
          </div>
          <iframe src="${gviewUrl}"></iframe>
        </body>
        </html>
      `);
    }

    // Images, videos → inline
    return res.redirect(viewUrl);
  } catch (err) {
    console.error('[View Error]', err);
    return res.status(500).json({ message: 'Server error', error: err.message});
  }
};

/* ===========================
   Download
=========================== */
exports.downloadFile = async (req, res) => {
  try {
    const file = await FileModel.getById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    if (!file.cloud_id) return res.status(400).json({ message: 'This file has no content' });

    const mt = file.mime_type || mime.lookup(file.file_name) || 'application/octet-stream';
    const attachmentName = safeAttachmentName(file.file_name);

    // PDFs → stream download
    if (mt === 'application/pdf') {
      try {
        const viewUrl = buildViewUrl(file);
        const response = await axios.get(viewUrl, { responseType: 'stream' });

        res.setHeader('Content-Disposition', `attachment; filename="${attachmentName}"`);
        res.setHeader('Content-Type', 'application/pdf');
        if (response.headers['content-length']) {
          res.setHeader('Content-Length', response.headers['content-length']);
        }

        response.data.pipe(res);
        return;
      } catch (err) {
        console.error('[PDF Download Error]', err);
        const fallbackUrl = buildDownloadUrl(file);
        return res.redirect(fallbackUrl);
      }
    }

    // Others → force download
    const downloadUrl = buildDownloadUrl(file);
    return res.redirect(downloadUrl);
  } catch (err) {
    console.error('[Download Error]', err);
    return res.status(500).json({ message: 'Server error', error: err.message});
  }
};

/* ===========================
   Delete
=========================== */
exports.deleteFile = async (req, res) => {
  try {
    const file = await FileModel.getById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    const mt = file.mime_type || mime.lookup(file.file_name) || 'application/octet-stream';
    const resource_type = getResourceType(mt, file.file_type);

    if (file.cloud_id) {
      await cloudinary.uploader.destroy(file.cloud_id, { resource_type });
    }

    await FileModel.delete(req.params.id);
    return res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('[Delete Error]', err);
    return res.status(500).json({ message: 'Server error', error: err.message});
  }
};
