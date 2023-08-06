
const express = require("express");
const crypto = require("crypto");
const { default: fetch } = require("node-fetch");
const Airtable = require("airtable");
// Initializes Express app.
const app = express();

// Parses JSON bodies.
app.use(express.json());
let secret = "";
// Local endpoint for receiving events
app.get("/create",async(req,res)=>{
  await fetch("https://app.asana.com/api/1.0/webhooks",{
    method:"POST",
    headers:{
      "Authorization":"Bearer 1/1205213038154528:afe486916dbbcc0d0b217913cc19bab9"
    },
  })
})
app.post("/receiveWebhook", (req, res) => {
  if (req.headers["x-hook-secret"]) {
    console.log("This is a new webhook");
    secret = req.headers["x-hook-secret"];
    res.setHeader("X-Hook-Secret", secret);
    res.sendStatus(200);
  } else if (req.headers["x-hook-signature"]) {
    const computedSignature = crypto
      .createHmac("SHA256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(req.headers["x-hook-signature"]),
        Buffer.from(computedSignature)
      )
    ) {
      // Fail
      res.sendStatus(401);
    } else {
      // Success
      res.sendStatus(200);
      // console.log(`Events on ${Date()}:`);
      console.log(req.body.events);

      req.body.events.forEach(async (event) => {
        let gid_id = event.resource.gid;
        console.log(gid_id);
        await fetch(`https://app.asana.com/api/1.0/tasks/${gid_id}`, {
          headers: {
            Authorization:
              "Bearer 1/1205213038154528:afe486916dbbcc0d0b217913cc19bab9",
          },
        })
          .then((res) => res.json())
          .then((data1) => {
            let data = data1.data;
            const baseId = "appQSFVYddc1sAfmp";
            const tableIdOrName = "tblc7hSE5NG6tyrAN";
            const apiKey =
              "patZEE0P9CcuXK2Va.6f6517bcc770bbaeafbba962cb6cdba171880cdfedf258c7730fa8b1314f1352";

            const url = `https://api.airtable.com/v0/${baseId}/${tableIdOrName}`;

            const headers = {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            };
            if (
              data &&
              data.name &&
              data.assignee &&
              data.assignee.name &&
              data.gid &&
              data.due_on
            ) {
              const requestData = {
                records: [
                  {
                    fields: {
                      Name: data.name,
                      Assignee: data.assignee.name,
                      TaskID: parseInt(data.gid),
                      DueDate: data.due_on,
                    },
                  },
                ],
              };
              fetchData(requestData, url, headers);
            } else {
              console.log("Getting Error in line 197");
            }
          })
          .catch((err) => {
            // console.log("Error occurring here");
            console.log(err);
          });
      });
    }
  } else {
    console.error("Something went wrong!");
  }
});
app.listen(3000, () => {
  console.log(`Server started on port 3000`);
});
//
async function fetchData(requestData, url, headers) {
  await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Records added", data);
    })
    .catch((error) => {
      console.error("Error adding records:", error);
    });
}





// const express = require("express");
// const crypto = require("crypto");
// const { default: fetch } = require("node-fetch");
// const Airtable = require("airtable");
// // Initializes Express app.
// const app = express();

// // Parses JSON bodies.
// app.use(express.json());
// let secret = "";
// // Local endpoint for receiving events
// app.post("/receiveWebhook", (req, res) => {
//   if (req.headers["x-hook-secret"]) {
//     console.log("This is a new webhook");
//     secret = req.headers["x-hook-secret"];
//     res.setHeader("X-Hook-Secret", secret);
//     res.sendStatus(200);
//   } else if (req.headers["x-hook-signature"]) {
//     const computedSignature = crypto
//       .createHmac("SHA256", secret)
//       .update(JSON.stringify(req.body))
//       .digest("hex");

//     if (
//       !crypto.timingSafeEqual(
//         Buffer.from(req.headers["x-hook-signature"]),
//         Buffer.from(computedSignature)
//       )
//     ) {
//       // Fail
//       res.sendStatus(401);
//     } else {
//       // Success
//       res.sendStatus(200);
//       // console.log(`Events on ${Date()}:`);
//       console.log(req.body.events);

//       req.body.events.forEach(async (event) => {
//         let gid_id = event.resource.gid;
//         console.log(gid_id);
//         await fetch(`https://app.asana.com/api/1.0/tasks/${gid_id}`, {
//           headers: {
//             Authorization:
//               "Bearer 1/1205213038154528:afe486916dbbcc0d0b217913cc19bab9",
//           },
//         })
//           .then((res) => res.json())
//           .then((data1) => {
//             let data = data1.data;
//             const baseId = "appQSFVYddc1sAfmp";
//             const tableIdOrName = "tblc7hSE5NG6tyrAN";
//             const apiKey =
//               "patZEE0P9CcuXK2Va.6f6517bcc770bbaeafbba962cb6cdba171880cdfedf258c7730fa8b1314f1352";

//             const url = `https://api.airtable.com/v0/${baseId}/${tableIdOrName}`;

//             const headers = {
//               Authorization: `Bearer ${apiKey}`,
//               "Content-Type": "application/json",
//             };
//             if (
//               data &&
//               data.name &&
//               data.assignee &&
//               data.assignee.name &&
//               data.gid &&
//               data.due_on
//             ) {
//               const requestData = {
//                 records: [
//                   {
//                     fields: {
//                       Name: data.name,
//                       Assignee: data.assignee.name,
//                       TaskID: parseInt(data.gid),
//                       DueDate: data.due_on,
//                     },
//                   },
//                 ],
//               };
//               fetchData(requestData, url, headers);
//             } else {
//               console.log("Getting Error in line 197");
//             }
//           })
//           .catch((err) => {
//             // console.log("Error occurring here");
//             console.log(err);
//           });
//       });
//     }
//   } else {
//     console.error("Something went wrong!");
//   }
// });
// app.listen(3000, () => {
//   console.log(`Server started on port 3000`);
// });
// //
// async function fetchData(requestData, url, headers) {
//   await fetch(url, {
//     method: "POST",
//     headers: headers,
//     body: JSON.stringify(requestData),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("Records added", data);
//     })
//     .catch((error) => {
//       console.error("Error adding records:", error);
//     });
// }































// // const express = require("express");
// // const crypto = require("crypto");
// // const { default: fetch } = require("node-fetch");
// // const Airtable = require("airtable");
// // // Initializes Express app.
// // const app = express();

// // // Parses JSON bodies.
// // app.use(express.json());
// // let secret = "";
// // // Local endpoint for receiving events
// // app.post("/receiveWebhook", (req, res) => {
// //   if (req.headers["x-hook-secret"]) {
// //     console.log("This is a new webhook");
// //     secret = req.headers["x-hook-secret"];
// //     res.setHeader("X-Hook-Secret", secret);
// //     res.sendStatus(200);
// //   } else if (req.headers["x-hook-signature"]) {
// //     const computedSignature = crypto
// //       .createHmac("SHA256", secret)
// //       .update(JSON.stringify(req.body))
// //       .digest("hex");

// //     if (
// //       !crypto.timingSafeEqual(
// //         Buffer.from(req.headers["x-hook-signature"]),
// //         Buffer.from(computedSignature)
// //       )
// //     ) {
// //       // Fail
// //       res.sendStatus(401);
// //     } else {
// //       // Success
// //       res.sendStatus(200);
// //       // console.log(`Events on ${Date()}:`);
// //       console.log(req.body.events);

// //       req.body.events.forEach((event) => {
// //         let gid_id = event.resource.gid;
// //         console.log(gid_id);
// //         fetch(`https://app.asana.com/api/1.0/tasks/${gid_id}`, {
// //           headers: {
// //             Authorization:
// //               "Bearer 1/1205213038154528:afe486916dbbcc0d0b217913cc19bab9",
// //           },
// //         })
// //           .then((res) => res.json())
// //           .then((data1) => {
// //             let data = data1.data;
// //             const baseId = "appQSFVYddc1sAfmp";
// //             const tableIdOrName = "tblc7hSE5NG6tyrAN";
// //             const apiKey =
// //               "patZEE0P9CcuXK2Va.6f6517bcc770bbaeafbba962cb6cdba171880cdfedf258c7730fa8b1314f1352";

// //             const url = `https://api.airtable.com/v0/${baseId}/${tableIdOrName}`;

// //             const headers = {
// //               Authorization: `Bearer ${apiKey}`,
// //               "Content-Type": "application/json",
// //             };

// //             const requestData = {
// //               records: [
// //                 {
// //                   fields: {
// //                     Name: data.name,
// //                     Assignee: data.assignee.name,
// //                     TaskID: parseInt(data.gid),
// //                     DueDate: data.due_on,
// //                   },
// //                 },
// //               ],
// //             };

// //             fetch(url, {
// //               method: "POST",
// //               headers: headers,
// //               body: JSON.stringify(requestData),
// //             })
// //               .then((response) => response.json())
// //               .then((data) => {
// //                 console.log("Records added",data);
// //               })
// //               .catch((error) => {
// //                 console.error("Error adding records:", error);
// //               });
// //           })
// //           .catch((err) => {
// //             // console.log("Error occurring here");
// //             console.log(err);
// //           });
// //       });
// //     }
// //   } else {
// //     console.error("Something went wrong!");
// //   }
// // });
// // app.listen(3000, () => {
// //   console.log(`Server started on port 3000`);
// // });
// // //

// // const express = require("express");
// // const crypto = require("crypto");
// // const { default: fetch } = require("node-fetch");
// // const Airtable = require("airtable");
// // // Initializes Express app.
// // const app = express();

// // // Parses JSON bodies.
// // app.use(express.json());
// // let secret = "";
// // // Local endpoint for receiving events
// // app.post("/receiveWebhook", (req, res) => {
// //   if (req.headers["x-hook-secret"]) {
// //     console.log("This is a new webhook");
// //     secret = req.headers["x-hook-secret"];
// //     res.setHeader("X-Hook-Secret", secret);
// //     res.sendStatus(200);
// //   } else if (req.headers["x-hook-signature"]) {
// //     const computedSignature = crypto
// //       .createHmac("SHA256", secret)
// //       .update(JSON.stringify(req.body))
// //       .digest("hex");

// //     if (
// //       !crypto.timingSafeEqual(
// //         Buffer.from(req.headers["x-hook-signature"]),
// //         Buffer.from(computedSignature)
// //       )
// //     ) {
// //       // Fail
// //       res.sendStatus(401);
// //     } else {
// //       // Success
// //       res.sendStatus(200);
// //       // console.log(`Events on ${Date()}:`);
// //       console.log(req.body.events);

// //       req.body.events.forEach((event) => {
// //         let gid_id = event.resource.gid;
// //         console.log(gid_id);
// //         fetch(`https://app.asana.com/api/1.0/tasks/${gid_id}`, {
// //           headers: {
// //             Authorization:
// //               "Bearer 1/1205213038154528:afe486916dbbcc0d0b217913cc19bab9",
// //           },
// //         })
// //           .then((res) => res.json())
// //           .then((data1) => {
// //             let data = data1.data;
// //             const baseId = "appQSFVYddc1sAfmp";
// //             const tableIdOrName = "tblc7hSE5NG6tyrAN";
// //             const apiKey =
// //               "patZEE0P9CcuXK2Va.6f6517bcc770bbaeafbba962cb6cdba171880cdfedf258c7730fa8b1314f1352";

// //             const url = `https://api.airtable.com/v0/${baseId}/${tableIdOrName}`;

// //             const headers = {
// //               Authorization: `Bearer ${apiKey}`,
// //               "Content-Type": "application/json",
// //             };
// //             if (
// //               data &&
// //               data.name &&
// //               data.assignee &&
// //               data.assignee.name &&
// //               data.gid &&
// //               data.due_on
// //             ) {
// //               const requestData = {
// //                 records: [
// //                   {
// //                     fields: {
// //                       Name: data.name,
// //                       Assignee: data.assignee.name,
// //                       TaskID: parseInt(data.gid),
// //                       DueDate: data.due_on,
// //                     },
// //                   },
// //                 ],
// //               };

// //               fetch(url, {
// //                 method: "POST",
// //                 headers: headers,
// //                 body: JSON.stringify(requestData),
// //               })
// //                 .then((response) => response.json())
// //                 .then((data) => {
// //                   console.log("Records added", data);
// //                 })
// //                 .catch((error) => {
// //                   console.error("Error adding records:", error);
// //                 });
// //             }else{
// //               console.log("Getting Error in line 197")
// //             }
// //           })
// //           .catch((err) => {
// //             // console.log("Error occurring here");
// //             console.log(err);
// //           });
// //       });
// //     }
// //   } else {
// //     console.error("Something went wrong!");
// //   }
// // });
// // app.listen(3000, () => {
// //   console.log(`Server started on port 3000`);
// // });
// // //
