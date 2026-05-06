// Bangkok Laptop Hunt — Health check endpoint

import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const files = await fs.readdir(DATA_DIR);
    const shortlistFiles = files.filter(f => f.startsWith('shortlist-') && f.endsWith('.json'));

    return res.status(200).json({
      status: 'ok',
      project: 'bangkok-laptop-hunt',
      shortlists_available: shortlistFiles.length,
      latest: shortlistFiles.sort().reverse()[0] || null,
    });
  } catch (err) {
    return res.status(200).json({
      status: 'degraded',
      project: 'bangkok-laptop-hunt',
      error: err.message,
    });
  }
}
