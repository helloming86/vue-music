// Singer类，封装Singer基本信息
export default class Singer {
  // constructor 是一种用于创建和初始化class创建的对象的特殊方法。
  constructor ({ id, name }) {
    this.id = id
    this.name = name
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}
