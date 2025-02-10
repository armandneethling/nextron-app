import { createRouter } from 'next-connect';
import fs from 'fs';
import path from 'path';

const apiRoute = createRouter()
    .delete((req, res) => {
        const { filename } = req.query
        if (!filename) {
            return res.status(400).json({ error: 'Filename is required' });
        }

        const filePath = path.join(process.cwd(), 'renderer/public/videos', filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete video' });
            }
            res.status(200).json({ message: 'Video deleted successfully' });
        });
    })
    .handler();

export default apiRoute;

export const config = {
    api: {
        bodyParser: false,
    },
};
