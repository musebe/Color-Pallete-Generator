// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IncomingForm, Fields, Files } from "formidable";
import * as Vibrant from "node-vibrant";
import { handleCloudinaryUpload } from "../../lib/cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  switch (req.method) {
    case "POST": {
      try {
        const result = await handlePostRequest(req);

        return res.status(200).json({ message: "Success", result });
      } catch (error) {
        return res.status(400).json({ message: "Error", error });
      }
    }

    default: {
      return res.status(405).json({ message: "Method not allowed" });
    }
  }
}

const handlePostRequest = async (req) => {
  const data = await parseForm(req);

  const palette = await Vibrant.from(data?.files?.file.path).getPalette();

  const uploadResult = await handleCloudinaryUpload(data?.files?.file.path);

  return { palette, uploadResult };
};

/**
 *
 * @param {*} req
 * @returns {Promise<{ fields:Fields; files:Files; }>}
 */
const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ keepExtensions: true, multiples: true });

    form.parse(req, (error, fields, files) => {
      if (error) {
        return reject(error);
      }

      return resolve({ fields, files });
    });
  });
};
