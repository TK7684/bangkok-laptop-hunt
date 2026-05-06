// Bangkok Laptop Hunt — API: Latest shortlist
// Serves cached scraper results as JSON.
// The scraper runs separately (Docker/cron) and writes to data/.

import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Find the latest shortlist file
    const files = await fs.readdir(DATA_DIR);
    const shortlistFiles = files
      .filter(f => f.startsWith('shortlist-') && f.endsWith('.json'))
      .sort()
      .reverse();

    if (shortlistFiles.length === 0) {
      return res.status(200).json({
        status: 'no_data',
        message: 'No shortlist data yet. Run the scraper first.',
        budget_thb: 8000,
        location: 'Bangkok',
      });
    }

    const latestFile = shortlistFiles[0];
    const content = await fs.readFile(path.join(DATA_DIR, latestFile), 'utf-8');
    const data = JSON.parse(content);

    // Add metadata
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    return res.status(200).json({
      ...data,
      _meta: {
        source_file: latestFile,
        api_version: '1.0.0',
        project: 'bangkok-laptop-hunt',
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Failed to read shortlist data',
      details: err.message,
    });
  }
}
