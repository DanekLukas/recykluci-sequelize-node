import type { Sequelize } from "sequelize";
import { basket as _basket } from "./basket";
import type { basketAttributes, basketCreationAttributes } from "./basket";
import { category as _category } from "./category";
import type { categoryAttributes, categoryCreationAttributes } from "./category";
import { data as _data } from "./data";
import type { dataAttributes, dataCreationAttributes } from "./data";
import { delivery as _delivery } from "./delivery";
import type { deliveryAttributes, deliveryCreationAttributes } from "./delivery";
import { homepage as _homepage } from "./homepage";
import type { homepageAttributes, homepageCreationAttributes } from "./homepage";
import { image as _image } from "./image";
import type { imageAttributes, imageCreationAttributes } from "./image";
import { role as _role } from "./role";
import type { roleAttributes, roleCreationAttributes } from "./role";
import { sells as _sells } from "./sells";
import type { sellsAttributes, sellsCreationAttributes } from "./sells";
import { sells_item as _sells_item } from "./sells_item";
import type { sells_itemAttributes, sells_itemCreationAttributes } from "./sells_item";
import { size as _size } from "./size";
import type { sizeAttributes, sizeCreationAttributes } from "./size";
import { text as _text } from "./text";
import type { textAttributes, textCreationAttributes } from "./text";
import { user as _user } from "./user";
import type { userAttributes, userCreationAttributes } from "./user";

export {
  _basket as basket,
  _category as category,
  _data as data,
  _delivery as delivery,
  _homepage as homepage,
  _image as image,
  _role as role,
  _sells as sells,
  _sells_item as sells_item,
  _size as size,
  _text as text,
  _user as user,
};

export type {
  basketAttributes,
  basketCreationAttributes,
  categoryAttributes,
  categoryCreationAttributes,
  dataAttributes,
  dataCreationAttributes,
  deliveryAttributes,
  deliveryCreationAttributes,
  homepageAttributes,
  homepageCreationAttributes,
  imageAttributes,
  imageCreationAttributes,
  roleAttributes,
  roleCreationAttributes,
  sellsAttributes,
  sellsCreationAttributes,
  sells_itemAttributes,
  sells_itemCreationAttributes,
  sizeAttributes,
  sizeCreationAttributes,
  textAttributes,
  textCreationAttributes,
  userAttributes,
  userCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const basket = _basket.initModel(sequelize);
  const category = _category.initModel(sequelize);
  const data = _data.initModel(sequelize);
  const delivery = _delivery.initModel(sequelize);
  const homepage = _homepage.initModel(sequelize);
  const image = _image.initModel(sequelize);
  const role = _role.initModel(sequelize);
  const sells = _sells.initModel(sequelize);
  const sells_item = _sells_item.initModel(sequelize);
  const size = _size.initModel(sequelize);
  const text = _text.initModel(sequelize);
  const user = _user.initModel(sequelize);

  data.belongsTo(category, { as: "category", foreignKey: "category_id"});
  category.hasMany(data, { as: "data", foreignKey: "category_id"});
  homepage.belongsTo(data, { as: "datum", foreignKey: "data_id"});
  data.hasMany(homepage, { as: "homepages", foreignKey: "data_id"});
  data.belongsTo(image, { as: "id_image", foreignKey: "id"});
  image.hasOne(data, { as: "datum", foreignKey: "id"});
  data.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(data, { as: "data", foreignKey: "user_id"});

  return {
    basket: basket,
    category: category,
    data: data,
    delivery: delivery,
    homepage: homepage,
    image: image,
    role: role,
    sells: sells,
    sells_item: sells_item,
    size: size,
    text: text,
    user: user,
  };
}
