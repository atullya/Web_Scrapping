// const axios = require("axios");
// const cheerio = require("cheerio");
// const fs = require("fs");
// const path = require("path");

// // URL of the page to scrape
// const url = "https://citymotorbike.com/motorbike-hire-rates-in-nepal/"; // Replace with the actual URL

// // Function to scrape the table data and save as JSON
// const scrapeTableData = async () => {
//   try {
//     // Fetch the page content
//     const { data } = await axios.get(url);

//     // Load the HTML into cheerio
//     const $ = cheerio.load(data);

//     // Array to store all rows' data
//     const tableData = [];

//     // Select the table and iterate over each row in the tbody
//     $("div.col-md-12 table.table-striped tbody tr").each((index, element) => {
//       const row = $(element).find("td");

//       // Extract and structure data from each column
//       const bikeData = {
//         id: $(row[0]).text().trim(),
//         model: $(row[1]).text().trim(),
//         modelLink: $(row[1]).find("a").attr("href"), // Extract the link if available
//         engineCapacity: $(row[2]).text().trim(),
//         ratePerDay: $(row[3]).text().trim(),
//         perMonth: $(row[4]).text().trim()
//       };

//       tableData.push(bikeData); // Add the bike data to the array
//     });

//     // Define the path to save the JSON file
//     const filePath = path.resolve(__dirname, "bikes.json");

//     // Write the data to a JSON file
//     fs.writeFileSync(filePath, JSON.stringify(tableData, null, 2), "utf-8");
//     console.log("Data saved to bikes.json");
//   } catch (error) {
//     console.error("Error scraping the page:", error);
//   }
// };

// // Start the scraping process
// scrapeTableData();

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// URL of the page to scrape images from
const url =
  "https://citymotorbike.com/bike/royal-enfield-rent-in-nepal/";

// Directory to save images
const imageDir = path.resolve(__dirname, "bikeImage");

// Function to download an image
const downloadImage = async (imageUrl, index) => {
  try {
    // Get the image data
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    // Extract file extension
    const extension = imageUrl.split(".").pop().split("?")[0];
    const fileName = `image_${index + 1}.${extension}`;
    const filePath = path.join(imageDir, fileName);

    // Save the image to the specified folder
    fs.writeFileSync(filePath, response.data);
    console.log(`Downloaded: ${fileName}`);
  } catch (error) {
    console.error("Error downloading image:", error.message);
  }
};

// Function to scrape all image URLs and download them
const scrapeImages = async () => {
  try {
    // Create the folder if it doesn't exist
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir);
      console.log("Created folder: bikeImage");
    }

    // Fetch the page content
    const { data } = await axios.get(url);

    // Load the HTML into cheerio
    const $ = cheerio.load(data);

    // Array to store image URLs
    const imageUrls = [];

    // Find all images on the page and retrieve src, data-src, and data-srcset attributes
    $("img").each((index, img) => {
      const src = $(img).attr("src");
      const dataSrc = $(img).attr("data-src");
      const dataSrcset = $(img).attr("data-srcset");

      if (src && src.startsWith("http")) {
        imageUrls.push(src);
      } else if (dataSrc && dataSrc.startsWith("http")) {
        imageUrls.push(dataSrc);
      } else if (dataSrcset) {
        const largestImageUrl = dataSrcset.split(",")[0].split(" ")[0];
        if (largestImageUrl.startsWith("http")) {
          imageUrls.push(largestImageUrl);
        }
      }
    });

    // Download each image
    for (const [index, imageUrl] of imageUrls.entries()) {
      await downloadImage(imageUrl, index);
    }

    console.log("All images downloaded.");
  } catch (error) {
    console.error("Error scraping images:", error.message);
  }
};

// Start the scraping and downloading process
scrapeImages();

// const axios = require("axios");
// const cheerio = require("cheerio");
// const fs = require("fs");
// const path = require("path");

// // Webpage URL (Daraz)
// const webpageUrl = "https://www.daraz.com.np/";

// // Function to download an image
// const downloadImage = async (url, imageName) => {
//   const writer = fs.createWriteStream(
//     path.resolve(__dirname, "images", imageName)
//   );
//   const response = await axios.get(url, { responseType: "stream" });
//   response.data.pipe(writer);

//   return new Promise((resolve, reject) => {
//     writer.on("finish", resolve);
//     writer.on("error", reject);
//   });
// };

// // Function to scrape the webpage and download all images with class `picture-wrapper`
// const scrapeAndDownloadImages = async () => {
//   try {
//     // Fetch the HTML content of the webpage
//     const response = await axios.get(webpageUrl);
//     const $ = cheerio.load(response.data);

//     // Create the images folder if it doesn't exist
//     if (!fs.existsSync("images")) {
//       fs.mkdirSync("images");
//     }

//     // Select all images inside `div.picture-wrapper` (i.e., `img` tags inside `div`)
//     $("div.picture-wrapper img").each(async (index, img) => {
//       let imgSrc = $(img).attr("src");
//       if (imgSrc) {
//         // If the src is a relative URL, prepend the base URL
//         if (imgSrc.startsWith("/")) {
//           imgSrc = `https://www.daraz.com.np${imgSrc}`;
//         }

//         const imageName = `image_${index + 1}.jpg`; // Image file name
//         console.log(`Downloading image: ${imgSrc}`);
//         try {
//           await downloadImage(imgSrc, imageName);
//           console.log(`Downloaded: ${imageName}`);
//         } catch (error) {
//           console.log(`Failed to download image: ${imgSrc}`);
//         }
//       }
//     });
//   } catch (error) {
//     console.error("Error scraping the page:", error);
//   }
// };

// // // // Call the function to start scraping and downloading images
// scrapeAndDownloadImages();

// const scrapeAndDownloadImages = async () => {
//   try {
//     // Fetch the HTML content of the webpage
//     const response = await axios.get(webpageUrl);
//     const $ = cheerio.load(response.data);

//     // Create the images folder if it doesn't exist
//     if (!fs.existsSync("images")) {
//       fs.mkdirSync("images");
//     }

//     // Select all images inside div.picture-wrapper (i.e., img tags inside div)
//     $("div.picture-wrapper img").each(async (index, img) => {
//       let imgSrc = $(img).attr("src");
//       if (imgSrc) {
//         // If the src is a relative URL, prepend the base URL
//         if (imgSrc.startsWith("/")) {
//           imgSrc = https://www.daraz.com.np${imgSrc};
//         }

//         const imageName = image_${index + 1}.jpg; // Image file name
//         console.log(Downloading image: ${imgSrc});
//         try {
//           await downloadImage(imgSrc, imageName);
//           console.log(Downloaded: ${imageName});
//         } catch (error) {
//           console.log(Failed to download image: ${imgSrc});
//         }
//       }
//     });
//   } catch (error) {
//     console.error("Error scraping the page:", error);
//   }
// };

// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');

// const webpageUrl = "https://www.daraz.com.np/";

// const scrapeProductDetails = async () => {
//   try {
//     // Launch Puppeteer browser
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     // Navigate to the webpage
//     await page.goto(webpageUrl, { waitUntil: 'networkidle2' });

//     // Extract product details using page.evaluate() to access the DOM
//     const products = await page.evaluate(() => {
//       const productList = [];
//       const productElements = document.querySelectorAll("div.card-jfy-item-desc");

//       productElements.forEach((element) => {
//         const title = element.querySelector("div.card-jfy-title.two-line-clamp")?.textContent.trim();
//         const price = element.querySelector("div.hp-mod-price .price")?.textContent.trim();
//         const discount = element.querySelector("span.hp-mod-discount")?.textContent.trim();

//         if (title && price && discount) {
//           productList.push({ title, price, discount });
//         }
//       });

//       return productList;
//     });

//     // Close the browser
//     await browser.close();

//     // Save the product details to a JSON file
//     if (products.length === 0) {
//       console.log("No products found.");
//     } else {
//       fs.writeFileSync(path.resolve(__dirname, "products.json"), JSON.stringify(products, null, 2));
//       console.log("Product details saved to products.json");
//     }

//   } catch (error) {
//     console.error("Error scraping the page:", error);
//   }
// };

// // Start scraping
// scrapeProductDetails();

// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');

// const webpageUrl = "https://www.daraz.com.np/";

// const scrapeProductDetails = async () => {
//   try {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.goto(webpageUrl, { waitUntil: 'networkidle2' });

//     await page.waitForSelector("div.card-jfy-item-desc", { timeout: 5000 });

//     const products = await page.evaluate(() => {
//       const productList = [];
//       const productElements = document.querySelectorAll("div.card-jfy-item-desc");

//       productElements.forEach((element) => {
//         const title = element.querySelector("div.card-jfy-title.two-line-clamp")?.textContent.trim();
//         const price = element.querySelector("div.hp-mod-price .price")?.textContent.trim();
//         const discount = element.querySelector("span.hp-mod-discount")?.textContent.trim();

//         // Try getting image URL from data-src or src
//         let imageUrl = element.querySelector("img")?.getAttribute('data-src') || element.querySelector("img")?.getAttribute('src');

//         console.log(imageUrl); // Debugging log to check the image URL

//         const fullImageUrl = imageUrl && imageUrl.startsWith('http') ? imageUrl : `https:${imageUrl}`;

//         if (title && price && discount && fullImageUrl) {
//           productList.push({ title, price, discount, imageUrl: fullImageUrl });
//         }
//       });

//       return productList;
//     });

//     await browser.close();

//     if (products.length === 0) {
//       console.log("No products found.");
//     } else {
//       fs.writeFileSync(path.resolve(__dirname, "products.json"), JSON.stringify(products, null, 2));
//       console.log("Product details saved to products.json");
//     }

//   } catch (error) {
//     console.error("Error scraping the page:", error);
//   }
// };

// scrapeProductDetails();
