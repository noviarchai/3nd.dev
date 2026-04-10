content = open('/var/www/danditos.nex.monster/lib/db.ts').read()

old_update = """UPDATE products SET name=$1, slug=$2, description=$3, heat_level=$4, price=$5, stock=$6, image_url=$7, is_active=$8 WHERE id=$9 RETURNING *',
    [data.name, data.slug, data.description, data.heat_level, data.price, data.stock, data.image_url, data.is_active, id]"""

new_update = """UPDATE products SET name=$1, slug=$2, description=$3, heat_level=$4, price=$5, stock=$6, image_url=$7, is_active=$8, weight_grams=$9 WHERE id=$10 RETURNING *',
    [data.name, data.slug, data.description, data.heat_level, data.price, data.stock, data.image_url, data.is_active, data.weight_grams || 300, id]"""

old_create = """INSERT INTO products (name, slug, description, heat_level, price, stock, image_url, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [data.name, data.slug, data.description, data.heat_level, data.price, data.stock, data.image_url, data.is_active || true]"""

new_create = """INSERT INTO products (name, slug, description, heat_level, price, stock, image_url, is_active, weight_grams) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [data.name, data.slug, data.description, data.heat_level, data.price, data.stock, data.image_url, data.is_active || true, data.weight_grams || 300]"""

content = content.replace(old_update, new_update)
content = content.replace(old_create, new_create)
open('/var/www/danditos.nex.monster/lib/db.ts', 'w').write(content)
print('Done')
