import { randomUUID } from "crypto";
import { sql } from "./db";

type ProductActivityRow = {
  id: string;
  product_id: string;
  user_id: string;
  username_snapshot: string;
  action: "EDITAR";
  created_at: string;
};

type DeletedProductRow = {
  id: string;
  old_product_id: string;
  product_name: string;
  user_id: string;
  username_snapshot: string;
  created_at: string;
};

export type ProductActivityItem = {
  id: string;
  productId: string;
  userId: string;
  username: string;
  action: "EDITAR";
  createdAt: string;
};

export type DeletedProductItem = {
  id: string;
  oldProductId: string;
  productName: string;
  userId: string;
  username: string;
  createdAt: string;
};

function mapProductActivityRow(
  row: ProductActivityRow
): ProductActivityItem {
  return {
    id: row.id,
    productId: row.product_id,
    userId: row.user_id,
    username: row.username_snapshot,
    action: row.action,
    createdAt: row.created_at,
  };
}

function mapDeletedProductRow(row: DeletedProductRow): DeletedProductItem {
  return {
    id: row.id,
    oldProductId: row.old_product_id,
    productName: row.product_name,
    userId: row.user_id,
    username: row.username_snapshot,
    createdAt: row.created_at,
  };
}

export async function logProductEdit(params: {
  productId: string;
  userId: string;
  username: string;
}) {
  await sql`
    INSERT INTO product_activity_logs (
      id,
      product_id,
      user_id,
      username_snapshot,
      action,
      created_at
    )
    VALUES (
      ${randomUUID()},
      ${params.productId},
      ${params.userId},
      ${params.username},
      'EDITAR',
      NOW()
    )
  `;
}

export async function getProductActivity(productId: string) {
  const rows = (await sql`
    SELECT *
    FROM product_activity_logs
    WHERE product_id = ${productId}
    ORDER BY created_at DESC
  `) as ProductActivityRow[];

  return rows.map(mapProductActivityRow);
}

export async function logDeletedProduct(params: {
  oldProductId: string;
  productName: string;
  userId: string;
  username: string;
}) {
  await sql`
    INSERT INTO deleted_product_logs (
      id,
      old_product_id,
      product_name,
      user_id,
      username_snapshot,
      created_at
    )
    VALUES (
      ${randomUUID()},
      ${params.oldProductId},
      ${params.productName},
      ${params.userId},
      ${params.username},
      NOW()
    )
  `;
}

export async function getDeletedProducts() {
  const rows = (await sql`
    SELECT *
    FROM deleted_product_logs
    ORDER BY created_at DESC
  `) as DeletedProductRow[];

  return rows.map(mapDeletedProductRow);
}