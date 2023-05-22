import { rest, setupWorker } from "msw";
import { factory, primaryKey } from "@mswjs/data";

export interface Product {
  id: string;
  name: string;
  manufacturedCountry: {
    code: string;
    label: string;
  };
  manufacturedDate: string;
  price: number;
}

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
  price: 200,
});
db.product.create({
  id: "2",
  name: "foam",
  manufacturedDate: new Date("2021-05-22").toString(),
  price: 120,
});

const handlers = [
  rest.get("/products", (req, res, ctx) => {
    return res(ctx.delay(2000), ctx.json(db.product.getAll()));
  }),
  rest.post<Product>("/products", (req, res, ctx) => {
    try {
      const createdEntity = db.product.create(req.body);
      return res(ctx.delay(2000), ctx.status(201), ctx.json(createdEntity));
    } catch (error) {
      console.error((error as Error).message);
      return res(
        ctx.status(500),
        ctx.json({
          message: (error as Error).message,
        })
      );
    }
  }),
  rest.put<Product>("/products/:id", (req, res, ctx) => {
    try {
      const updatedEntity = db.product.update({
        strict: true,
        where: {
          id: {
            equals: req.params.id as string,
          },
        },
        data: req.body,
      });
      return res(ctx.delay(2000), ctx.json(updatedEntity));
    } catch (error) {
      console.error((error as Error).message);
      return res(
        ctx.status(500),
        ctx.json({
          message: (error as Error).message,
        })
      );
    }
  }),
  rest.delete("/products/:id", (req, res, ctx) => {
    const deletedEntity = db.product.delete({
      // strict: true,
      where: {
        id: {
          equals: req.params.id as string,
        },
      },
    });
    return res(ctx.delay(2000), ctx.json(deletedEntity));
  }),
  rest.all("*", (req, res, ctx) => {
    return req.passthrough();
  }),
];

export const worker = setupWorker(...handlers);
