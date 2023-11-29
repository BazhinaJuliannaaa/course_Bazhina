from datetime import date
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Administrator(db.Model):
    __tablename__ = 'administrator'
    AdministratorLogin = db.Column(db.String(50), primary_key=True)
    AdministratorName = db.Column(db.String(20), nullable=False)
    AdministratorPassword = db.Column(db.String(20), nullable=False)

class Supplier(db.Model):
    __tablename__ = 'supplier'
    SupplierLogin = db.Column(db.String(50), primary_key=True)
    SupplierPassword = db.Column(db.String(20), nullable=False)
    SupplierName = db.Column(db.String(20), nullable=False)
    AdministratorLogin = db.Column(db.String(50), db.ForeignKey('administrator.AdministratorLogin'), nullable=False)
    PermissionToTrade = db.Column(db.Integer, nullable=False)

class Categories(db.Model):
    __tablename__ = 'categories'
    CaregoryName = db.Column(db.String(20), primary_key=True)
    AdminisrtatorLogin = db.Column(db.String(50), db.ForeignKey('administrator.AdministratorLogin'), nullable=False)

class ProductCards(db.Model):
    __tablename__ = 'productcards'
    ItemNumber = db.Column(db.Integer, primary_key=True, autoincrement=True)
    CaregoryName = db.Column(db.String(20), db.ForeignKey('categories.CaregoryName'), nullable=False)
    SupplierLogin = db.Column(db.String(50), db.ForeignKey('supplier.SupplierLogin'), nullable=False)
    ProductName = db.Column(db.String(100), nullable=False)
    ProductDescription = db.Column(db.Text, nullable=False)
    QuantityProductInStock = db.Column(db.Integer, nullable=False)
    CostProduct = db.Column(db.Integer, nullable=False)
    PhotoProduct = db.Column(db.String(255), nullable=False)

class Buyer(db.Model):
    __tablename__ = 'buyer'
    BuyerLogin = db.Column(db.String(50), primary_key=True)
    BuyerPassword = db.Column(db.String(20), nullable=False)
    DeliveryAdress = db.Column(db.String(255), nullable=False)
    BuyerName = db.Column(db.String(20), nullable=False)

class Orders(db.Model):
    __tablename__ = 'orders'
    OrderNumber = db.Column(db.Integer, primary_key=True, autoincrement=True)
    BuyerLogin = db.Column(db.String(20), db.ForeignKey('buyer.BuyerLogin'), nullable=False)
    OrderStatus = db.Column(db.Integer, nullable=False)
    AdministratorLogin = db.Column(db.String(20), nullable=False)
    OrderDate = db.Column(db.Date, nullable=True, default=None)

class ProductInOrder(db.Model):
    __tablename__ = 'productinorder'
    ItemNumber = db.Column(db.Integer, nullable=False)
    OrderNumber = db.Column(db.Integer, nullable=False)
    Quantity = db.Column(db.Integer, nullable=False)
    Cost = db.Column(db.Integer, nullable=False, primary_key=True)
    __table_args__ = (
        db.PrimaryKeyConstraint('ItemNumber', 'OrderNumber'),
        db.ForeignKeyConstraint(['OrderNumber'], ['orders.OrderNumber'], ondelete='RESTRICT', onupdate='RESTRICT'),
        db.ForeignKeyConstraint(['ItemNumber'], ['productcards.ItemNumber'], ondelete='RESTRICT', onupdate='RESTRICT')
    )

class Feedback(db.Model):
    __tablename__ = 'feedback'
    ItemNumber = db.Column(db.Integer, nullable=False)
    BuyerLogin = db.Column(db.String(20), nullable=False)
    ContentFeedback = db.Column(db.Text, nullable=False)
    date = db.Column(db.Date, nullable=False)
    __table_args__ = (
        db.PrimaryKeyConstraint('ItemNumber', 'BuyerLogin'),
        db.ForeignKeyConstraint(['ItemNumber'], ['productcards.ItemNumber'], ondelete='RESTRICT', onupdate='RESTRICT'),
        db.ForeignKeyConstraint(['BuyerLogin'], ['buyer.BuyerLogin'], ondelete='RESTRICT', onupdate='RESTRICT')
    )

class FavoritesAtBuyer(db.Model):
    __tablename__ = 'favoritesatbuyer'
    BuyerLogin = db.Column(db.String(20), nullable=False)
    ItemNumber = db.Column(db.Integer, nullable=False)
    __table_args__ = (
        db.PrimaryKeyConstraint('BuyerLogin', 'ItemNumber'),
        db.ForeignKeyConstraint(['BuyerLogin'], ['buyer.BuyerLogin'], ondelete='RESTRICT', onupdate='RESTRICT'),
        db.ForeignKeyConstraint(['ItemNumber'], ['productcards.ItemNumber'], ondelete='RESTRICT', onupdate='RESTRICT')
    )


    '''
    статусы заказа:
    0 - Не оформлен. В этом случае заказ находится на этапе формирования (в корзине), где пользователь добавляет или удаляет товары, которые хочет приобрести. Статус добавляется автоматически при добавлении первого товара в корзину.
    1 - (кнопка купить в корзине) Оплачен. Пользователь выбрал товары и оплатил их. Статус изменяется автоматически после оплаты товара.
    2 - (админ) Передан в доставку. Товар собран на складе и отправлен службе доставки. Статус заказа изменяет администратор магазина, который как раз передает информацию о заказе службе доставки.
    3 - (админ) Доставлен. Товар доставлен до получателя. Статус изменяет администратор после того, как получит информацию от службы доставки об успешном выполнении заказа.
    '''
    '''
    ALTER TABLE `orders` ADD `OrderDate` DATE NULL DEFAULT NULL AFTER `AdministratorLogin`;
    '''