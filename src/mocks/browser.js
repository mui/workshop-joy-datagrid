import { rest, setupWorker } from "msw";
import { factory, primaryKey } from "@mswjs/data";

const db = factory({
  product: {
    id: primaryKey(String),
    name: String,
    manufacturedDate: Date,
    manufacturedCountry: {
      code: String,
      label: String,
    },
    price: Number,
  },
});

db.product.create({
  id: "1",
  name: "spray",
  manufacturedDate: new Date().toString(),
  manufacturedCountry: null,
  price: 200,
});
db.product.create({
  id: "2",
  name: "foam",
  manufacturedDate: new Date("2021-05-22").toString(),
  manufacturedCountry: null,
  price: 120,
});

/**
 * Rest API handlers
 */
const handlers = [
  /**
   * To test this API, Try this in your browser console:
   *
    fetch("/products").then((res) => res.json()).then(console.log)
   */
  rest.get("/products", (req, res, ctx) => {
    return res(ctx.delay(2000), ctx.json(db.product.getAll()));
  }),
  /**
   * To test this API, Try this in your browser console:
   * 
    fetch(`/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "3",
        name: "dish washer",
        price: 1200,
        manufacturedDate: new Date().toString()
      }),
    })
   */
  rest.post("/products", (req, res, ctx) => {
    try {
      const createdEntity = db.product.create(req.body);
      return res(ctx.delay(2000), ctx.status(201), ctx.json(createdEntity));
    } catch (error) {
      console.error(error.message);
      return res(
        ctx.status(500),
        ctx.json({
          message: error.message,
        })
      );
    }
  }),
  /**
   * To test this API, Try this in your browser console:
   * 
    fetch(`/products/1`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "spray2",
      }),
    })
   */
  rest.put("/products/:id", (req, res, ctx) => {
    try {
      const updatedEntity = db.product.update({
        strict: true,
        where: {
          id: {
            equals: req.params.id,
          },
        },
        data: req.body,
      });
      return res(ctx.delay(2000), ctx.json(updatedEntity));
    } catch (error) {
      console.error(error.message);
      return res(
        ctx.status(500),
        ctx.json({
          message: error.message,
        })
      );
    }
  }),
  /**
   * To test this API, Try this in your browser console:
   * 
    fetch(`/products/1`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
   */
  rest.delete("/products/:id", (req, res, ctx) => {
    const deletedEntity = db.product.delete({
      // strict: true,
      where: {
        id: {
          equals: req.params.id,
        },
      },
    });
    return res(ctx.delay(2000), ctx.json(deletedEntity));
  }),
  rest.all("*", (req) => {
    return req.passthrough();
  }),
];

export const worker = setupWorker(...handlers);
