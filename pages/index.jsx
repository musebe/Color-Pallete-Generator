import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Palette } from "@vibrant/color";

export default function Home() {
  /**
   * Holds the selected image file
   * @type {[File,Function]}
   */
  const [file, setFile] = useState(null);

  /**
   * Holds the uploading/loading state
   *  @type {[boolean,Function]}
   */
  const [loading, setLoading] = useState(false);

  /**
   * Holds the result of the upload. This contains the cloudinary upload result and the color palette
   *  @type {[{palette:Palette,uploadResult:UploadApiResponse},Function]}
   */
  const [result, setResult] = useState();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const formData = new FormData(e.target);

      const response = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.result);

        // Get the root document
        const htmlDoc = document.querySelector("html");

        // Set the primary color CSS variable to the palette's DarkVibrant color
        htmlDoc.style.setProperty(
          "--primary-color",
          `rgb(${data.result.palette.DarkVibrant.rgb.join(" ")})`
        );

        // Set the secondary color CSS variable to the palette's Muted color
        htmlDoc.style.setProperty(
          "--secondary-color",
          `rgb(${data.result.palette.Muted.rgb.join(" ")})`
        );

        // Set the background color CSS variable to the palette's Vibrant color
        htmlDoc.style.setProperty(
          "--background-color",
          `rgb(${data.result.palette.Vibrant.rgb.join(" ")})`
        );

        return;
      }

      throw data;
    } catch (error) {
      // TODO: Show error message to user
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <Head>
        <title>Generate Color Palette with Next.js</title>
        <meta
          name="description"
          content="Generate Color Palette with Next.js"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container">
        <div className="header">
          <h1>Generate Color Palette with Next.js</h1>
        </div>
        {!result && (
          <form className="upload" onSubmit={handleFormSubmit}>
            {file && <p>{file.name} selected</p>}
            <label htmlFor="file">
              <p>
                <b>Tap To Select Image</b>
              </p>
            </label>
            <br />
            <input
              type="file"
              name="file"
              id="file"
              accept=".jpg,.png"
              multiple={false}
              required
              disabled={loading}
              onChange={(e) => {
                const file = e.target.files[0];

                setFile(file);
              }}
            />
            <button type="submit" disabled={loading || !file}>
              Upload Image
            </button>
          </form>
        )}
        {loading && (
          <div className="loading">
            <hr />
            <p>Please wait as the image uploads</p>
            <hr />
          </div>
        )}
        {result && (
          <div className="image-container">
            <div className="image-wrapper">
              <Image
                className="image"
                src={result.uploadResult.secure_url}
                alt={result.uploadResult.secure_url}
                layout="fill"
              ></Image>
              <div className="palette">
                {Object.entries(result.palette).map(([key, value], index) => (
                  <div
                    key={index}
                    className="color"
                    style={{
                      backgroundColor: `rgb(${value.rgb.join(" ")})`,
                    }}
                  >
                    <b>{key}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <style jsx>{`
        main {
          width: 100%;
          height: 100vh;
          background-color: var(--background-color);
          display: flex;
          flex-flow: column;
          justify-content: flex-start;
          align-items: center;
        }

        main .header {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--secondary-color);
          padding: 0 40px;
          color: white;
        }

        main .header h1 {
          -webkit-text-stroke: 1px #000000;
        }

        main .loading {
          color: white;
        }

        main form {
          width: 50%;
          padding: 20px;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          border-radius: 5px;
          margin: 20px auto;
          background-color: #ffffff;
        }

        main form label {
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          background-color: #777777;
          color: #ffffff;
          border-radius: 5px;
        }

        main form label:hover:not([disabled]) {
          background-color: var(--primary-color);
        }

        main form input {
          opacity: 0;
          width: 0.1px;
          height: 0.1px;
        }

        main form button {
          padding: 15px 30px;
          border: none;
          background-color: #e0e0e0;
          border-radius: 5px;
          color: #000000;
          font-weight: bold;
          font-size: 18px;
        }

        main form button:hover:not([disabled]) {
          background-color: var(--primary-color);
          color: #ffffff;
        }

        main div.image-container {
          position: relative;
          width: 100%;
          flex: 1 0;
        }

        main div.image-container .image-wrapper {
          position: relative;
          margin: auto;
          width: 80%;
          height: 100%;
        }

        main div.image-container div.image-wrapper .image-wrapper .image {
          object-fit: cover;
        }

        main div.image-container .image-wrapper .palette {
          width: 100%;
          height: 150px;
          position: absolute;
          bottom: 0;
          left: 0;
          background-color: rgba(255, 255, 255, 50%);
          display: flex;
          flex-flow: row nowrap;
          justify-content: flex-start;
        }

        main div.image-container .image-wrapper .palette .color {
          flex: 1;
          margin: 5px;
        }

        main div.image-container .image-wrapper .palette .color b {
          background-color: #ffffff;
          padding: 0 5px;
        }
      `}</style>
    </div>
  );
}
