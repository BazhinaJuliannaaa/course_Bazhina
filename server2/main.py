from flask import Flask, jsonify, request, session, url_for
from Models import db, Administrator, Supplier, Buyer, Categories, ProductCards, FavoritesAtBuyer, Orders,ProductInOrder,Feedback
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import func, or_
from decimal import Decimal
import secrets
import os
from datetime import date
from datetime import datetime

app = Flask(__name__)

app.secret_key = secrets.token_hex(16)
app.config['STATIC_FOLDER'] = 'C:\\Users\\bazhi\\Desktop\\course\\server2\\static'
# Настройки базы данных для MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@127.0.0.1:3306/course'
db.init_app(app)



# Роут для входа пользователя
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    login = data.get('login')
    password = data.get('password')
    # Попробуйте найти пользователя с заданным логином в разных таблицах
    buyer = Buyer.query.filter_by(BuyerLogin=login).first()
    supplier = Supplier.query.filter_by(SupplierLogin=login).first()
    administrator = Administrator.query.filter_by(AdministratorLogin=login).first()

    if not (buyer or supplier or administrator):
        return jsonify({'message': 'User not found'}), 404

    # Проверка пароля
    if buyer:
        if check_password_hash(buyer.BuyerPassword, password):
            session['user_login'] = login
            session['user_type'] = 'buyer'
            return jsonify({'message': 'Logged in successfully', 'user_type': session['user_type']}), 200
    elif supplier:
        if check_password_hash(supplier.SupplierPassword, password):
            session['user_login'] = login
            session['user_type'] = 'supplier'
            return jsonify({'message': 'Logged in successfully', 'user_type': session['user_type']}), 200
    elif administrator:
        if administrator and check_password_hash(administrator.AdministratorPassword, password):
            session['user_login'] = login
            session['user_type'] = 'administrator'
            return jsonify({'message': 'Logged in successfully', 'user_type': session['user_type']}), 200
    return jsonify({'message': 'Invalid credentials'}), 401


# Роут для выхода пользователя
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_type', None)
    session.pop('user_login', None)
    return jsonify({'message': 'Logged out successfully'}), 200


@app.route('/registration', methods=['POST'])
def register():
    data = request.get_json()
    login = data.get('login')
    password = data.get('password')
    user_type = data.get('userType')
    hashed_password = generate_password_hash(password)
    print(data)
    # Проверка, существует ли уже пользователь с таким логином
    existing_buyer = Buyer.query.filter_by(BuyerLogin=login).first()
    existing_supplier = Supplier.query.filter_by(SupplierLogin=login).first()
    existing_administrator = Administrator.query.filter_by(AdministratorLogin=login).first()

    if existing_buyer or existing_supplier or existing_administrator:
        print('User with this login already exists')
        return jsonify({'message': 'User with this login already exists'}), 400


    # Хэшируем пароль перед сохранением в базе данных
    if user_type == 'buyer':
        new_user = Buyer(BuyerLogin=login, BuyerPassword=hashed_password, DeliveryAdress="delivery_address",
                         BuyerName=data.get('firstname'))
    elif user_type == 'supplier':
        new_user = Supplier(SupplierLogin=login, SupplierPassword=hashed_password, SupplierName=data.get('firstname'),
                            PermissionToTrade="No", AdministratorLogin='admin')
    elif user_type == 'administrator':
        new_user = Administrator(AdministratorLogin=login, AdministratorName=data.get('firstname'),
                                 AdministratorPassword=hashed_password)
    else:
        print('Invalid user type')
        return jsonify({'message': 'Invalid user type'}), 400

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/admin/acceptSupplier', methods=['GET'])
def printSupplier():
    result = []
    suppliers = Supplier.query.filter_by(PermissionToTrade='0').all()
    for supplier in suppliers:
        supplier_data = {
            "name": supplier.SupplierName,
            "login": supplier.SupplierLogin
        }
        result.append(supplier_data)
    print(result)
    return  jsonify(result)


@app.route('/supplier/accept', methods=['POST'])
def supplier_accept():
    data = request.get_json()
    supplier = Supplier.query.filter_by(SupplierLogin=data.get('login')).first()
    supplier.PermissionToTrade = 1
    db.session.commit()

    return jsonify({"message": "Accept"}), 200


@app.route('/supplier/deny', methods=['POST'])
def supplier_deny():
    data = request.get_json()
    supplier = Supplier.query.filter_by(SupplierLogin=data.get('login')).first()
    supplier.PermissionToTrade = -1
    db.session.commit()

    return jsonify({"message": "Deny"}), 200


@app.route('/addCategory', methods=['POST'])
def add_category():
    data = request.get_json()
    # Создаем новую категорию
    new_category = Categories(CaregoryName=data.get('categoryName'), AdminisrtatorLogin='admin')

    # Добавляем категорию в базу данных
    db.session.add(new_category)
    db.session.commit()
    return jsonify({"message": "Good"}), 200


@app.route('/Category', methods=['GET'])
def category():
    result = []
    categorys = Categories.query.all()
    for category in categorys:
        result.append(category.CaregoryName)
    print(result)
    return jsonify(result), 200


@app.route('/add_product', methods=['POST'])
def add_product():
    data = request.form  # Получаем данные о товаре из POST-запроса
    file = request.files['image']  # Получаем файл из POST-запроса
    print(data)
    print(file)

    # Проверяем, что файл был отправлен
    if file:
        filename = os.path.join(app.config['STATIC_FOLDER'], file.filename)
        print(filename)
        file.save(filename)

        # Создаем новую запись в таблице ProductCards
        new_product = ProductCards(
            CaregoryName=data['category'],
            SupplierLogin=session['user_login'],
            ProductName=data['name'],
            ProductDescription=data['description'],
            QuantityProductInStock=data['quantity'],
            CostProduct=data['price'],
            PhotoProduct=file.filename  # Сохраняем путь к файлу
        )

        db.session.add(new_product)
        db.session.commit()

        return jsonify({'message': 'Product added successfully'}), 200

    return jsonify({'message': 'Error adding product'}), 400


@app.route('/mycards', methods=['GET'])
def myCards():
    cards_list=[]
    cards = ProductCards.query.filter_by(SupplierLogin=session['user_login']).all()
    for card in cards:
        card_dict = {
            "CaregoryName": card.CaregoryName,
            "ProductName": card.ProductName,
            "ProductDescription": card.ProductDescription,
            "QuantityProductInStock": card.QuantityProductInStock,
            "CostProduct": card.CostProduct,
            "PhotoProduct": url_for('static', filename=card.PhotoProduct),
            "id": card.ItemNumber
        }
        cards_list.append(card_dict)
    return jsonify(cards_list), 200


@app.route('/allCards', methods=['GET'])
def AllCards():
    category = request.args.get('category')
    text = request.args.get('text')
    if category != 'все товары':
        if text:
            cards = ProductCards.query \
                .join(Categories, ProductCards.CaregoryName == Categories.CaregoryName) \
                .filter(Categories.CaregoryName == category,
                        or_(ProductCards.ProductName.like(f"%{text}%"),
                            ProductCards.ProductDescription.like(f"%{text}%"))) \
                .all()
        else:
            cards = ProductCards.query.join(Categories, ProductCards.CaregoryName == Categories.CaregoryName).filter(
                Categories.CaregoryName == category).all()
    else:
        if text:
            cards = ProductCards.query.filter(
                or_(ProductCards.ProductName.like(f"%{text}%"), ProductCards.ProductDescription.like(f"%{text}%")))
        else:
            cards = ProductCards.query.all()
    print(category,"---",text)
    cards_list=[]
    order = Orders.query.filter_by(BuyerLogin=session['user_login'], OrderStatus=0).first()
    for card in cards:
        favorite = FavoritesAtBuyer.query.filter_by(BuyerLogin=session['user_login'],ItemNumber=card.ItemNumber).first()
        if order:
            print(order)
            in_shopping_card = ProductInOrder.query.filter_by(OrderNumber=order.OrderNumber,ItemNumber=card.ItemNumber).first()
            print(in_shopping_card)
            if in_shopping_card:
                ShoppingCard = True
            else:
                ShoppingCard = False
        else:
            ShoppingCard = False
        if card.QuantityProductInStock>0:
            if favorite:
                card_dict = {
                    "CaregoryName": card.CaregoryName,
                    "ProductName": card.ProductName,
                    "ProductDescription": card.ProductDescription,
                    "QuantityProductInStock": card.QuantityProductInStock,
                    "CostProduct": card.CostProduct,
                    "PhotoProduct": url_for('static', filename=card.PhotoProduct),
                    "id": card.ItemNumber,
                    "inFavorite": True,
                    "inShoppingCard": ShoppingCard
                }
                cards_list.append(card_dict)
            else:
                card_dict = {
                    "CaregoryName": card.CaregoryName,
                    "ProductName": card.ProductName,
                    "ProductDescription": card.ProductDescription,
                    "QuantityProductInStock": card.QuantityProductInStock,
                    "CostProduct": card.CostProduct,
                    "PhotoProduct": url_for('static', filename=card.PhotoProduct),
                    "id": card.ItemNumber,
                    "inFavorite": False,
                    "inShoppingCard": ShoppingCard
                }
                cards_list.append(card_dict)
    return jsonify(cards_list), 200


@app.route('/admin/allSupplier', methods=['GET'])
def AllSupplier():
    result = []
    suppliers = Supplier.query.all()
    for supplier in suppliers:
        supplier_data = {
            "name": supplier.SupplierName,
            "login": supplier.SupplierLogin,
            "PermissionToTrade": supplier.PermissionToTrade,

        }
        result.append(supplier_data)
    print(result)
    return  jsonify(result)


@app.route('/supplier/changeCost', methods=['POST'])
def changeCost():
    data = request.get_json()
    new = ProductCards.query.filter_by(ItemNumber=data[0]).first()
    new.CostProduct = data[1]
    db.session.commit()
    return jsonify({'message': 'Product added successfully'}), 200


@app.route('/supplier/changeQuantity', methods=['POST'])
def changeQuantity():
    data = request.get_json()
    new = ProductCards.query.filter_by(ItemNumber=data[0]).first()
    new.QuantityProductInStock += int(data[1])
    db.session.commit()
    return jsonify({'message': 'Product added successfully'}), 200


@app.route('/permission', methods=['GET'])
def isPermission():
    permission = Supplier.query.filter_by(SupplierLogin=session['user_login']).first()
    if permission.PermissionToTrade == 1:
        return jsonify(True)
    else:
        return jsonify(False)


@app.route('/inFavorite', methods=['POST'])
def inFavorite():
    data = request.get_json()
    if data['inFavorite']:
        FavoritesAtBuyer.query.filter_by(BuyerLogin=session['user_login'], ItemNumber=data['id']).delete()
        db.session.commit()
        return jsonify({'message': 'Product deleted successfully'}), 200
    else:
        new_favorite = FavoritesAtBuyer(BuyerLogin=session['user_login'],ItemNumber=data['id'])
        db.session.add(new_favorite)
        db.session.commit()
        return jsonify({'message': 'Product added successfully'}), 200


@app.route('/FavoriteCards', methods=['GET'])
def FavoriteCards():
    cards_list=[]
    cards = ProductCards.query.all()
    order = Orders.query.filter_by(BuyerLogin=session['user_login'], OrderStatus=0).first()
    for card in cards:
        favorite = FavoritesAtBuyer.query.filter_by(BuyerLogin=session['user_login'],ItemNumber=card.ItemNumber).first()
        if favorite:
            if order:
                print(order)
                in_shopping_card = ProductInOrder.query.filter_by(OrderNumber=order.OrderNumber,ItemNumber=card.ItemNumber).first()
                print(in_shopping_card)
                if in_shopping_card:
                    ShoppingCard = True
                else:
                    ShoppingCard = False
            else:
                ShoppingCard = False

            card_dict = {
                "CaregoryName": card.CaregoryName,
                "ProductName": card.ProductName,
                "ProductDescription": card.ProductDescription,
                "QuantityProductInStock": card.QuantityProductInStock,
                "CostProduct": card.CostProduct,
                "PhotoProduct": url_for('static', filename=card.PhotoProduct),
                "id": card.ItemNumber,
                "inFavorite": True,
                "inShoppingCard": ShoppingCard

            }
            cards_list.append(card_dict)
    return jsonify(cards_list), 200


@app.route('/inShoppingCard', methods=['POST'])
def inShoppingCard():
    data = request.get_json()
    print(data)
    order = Orders.query.filter_by(BuyerLogin=session['user_login'],OrderStatus=0).first()
    print(order)
    if order:
        pass
    else:
        order = Orders(BuyerLogin=session['user_login'],OrderStatus=0,AdministratorLogin='admin')
        db.session.add(order)
    cost_product= ProductCards.query.filter_by(ItemNumber=data['id']).first()
    print(cost_product)
    product_in_order = ProductInOrder(ItemNumber=data['id'],OrderNumber= order.OrderNumber,Quantity=1,Cost= cost_product.CostProduct)
    db.session.add(product_in_order)
    db.session.commit()
    print(product_in_order)
    return jsonify({'message': 'Product added in shopping card successfully'}), 200


@app.route('/shoppingCart', methods=['GET'])
def getShoppingCart():
        shoppinglist = []
        order = Orders.query.filter_by(BuyerLogin=session['user_login'], OrderStatus=0).first()

        if order:
            products = (
                db.session.query(ProductInOrder, ProductCards)
                .join(ProductInOrder, ProductInOrder.ItemNumber == ProductCards.ItemNumber)
                .filter(ProductInOrder.OrderNumber == order.OrderNumber)
                .all()
            )

            for product_in_order, product_card in products:
                info_dict = {
                    "id": product_in_order.ItemNumber,
                    "ProductName": product_card.ProductName,
                    "PhotoProduct": url_for('static', filename=product_card.PhotoProduct),
                    "QuantityInOrder": product_in_order.Quantity,
                    "CostInOrder": product_in_order.Cost,
                    "AllQuantity": product_card.QuantityProductInStock
                }
                if product_card.QuantityProductInStock<product_in_order.Quantity:
                    info_dict["in_stock"]="no"
                else:
                    info_dict["in_stock"] = "yes"
                shoppinglist.append(info_dict)

        return jsonify(shoppinglist), 200


@app.route('/removeFromCart', methods=['POST'])
def removeFromCart():
    data = request.get_json()
    order = Orders.query.filter_by(BuyerLogin=session['user_login'], OrderStatus=0).first()
    ProductInOrder.query.filter_by(OrderNumber=order.OrderNumber, ItemNumber=data['id']).delete()
    db.session.commit()
    return jsonify({'message': 'Product deleted successfully'}), 200


@app.route('/changeCost', methods=['POST'])
def changeCostInCart():
    data=request.get_json()
    order = Orders.query.filter_by(BuyerLogin=session['user_login'], OrderStatus=0).first()
    product=ProductInOrder.query.filter_by(ItemNumber=data['id'],OrderNumber=order.OrderNumber).first()
    productCard=ProductCards.query.filter_by(ItemNumber=product.ItemNumber).first()
    if data['op']=='dec' and product.Quantity> 0:
        product.Quantity-=1
    elif data['op']=='inc' and productCard.QuantityProductInStock> product.Quantity:
        product.Quantity+=1
    costOneProduct = ProductCards.query.filter_by(ItemNumber=product.ItemNumber).first()
    product.Cost=product.Quantity * costOneProduct.CostProduct
    db.session.commit()
    return jsonify({'message': 'Quantity product changed'}), 200


@app.route('/adressAndCost', methods=['GET'])
def adressAndCost():
    adressAndCost = {}
    person = Buyer.query.filter_by(BuyerLogin=session['user_login']).first()
    adressAndCost["Adress"] = person.DeliveryAdress
    cost = 0
    order = Orders.query.filter_by(BuyerLogin=session['user_login'], OrderStatus=0).first()
    if order:
        products = ProductInOrder.query.filter_by(OrderNumber=order.OrderNumber)
        for product in products:
            cost+=product.Cost
    adressAndCost["Cost"] = cost
    return jsonify(adressAndCost), 200


@app.route('/changeAdress', methods=['POST'])
def changeAdress():
    data=request.get_json()
    person = Buyer.query.filter_by(BuyerLogin=session['user_login']).first()
    person.DeliveryAdress = data['newAdress']
    db.session.commit()
    return jsonify({'message': 'Adress buyer changed'}), 200

@app.route('/placeOrder', methods=['POST'])
def placeOrder():
    changeOrder = Orders.query.filter_by(BuyerLogin=session['user_login'],OrderStatus=0).first()
    changeOrder.OrderDate=date.today()
    products = ProductInOrder.query.filter_by(OrderNumber=changeOrder.OrderNumber).all()
    for product in products:
        product_inf=ProductCards.query.filter_by(ItemNumber=product.ItemNumber).first()
        product_inf.QuantityProductInStock-= product.Quantity
    changeOrder.OrderStatus = 1
    db.session.commit()
    return jsonify({'message': 'Order changed status on 1'}), 200

@app.route('/AllOrders', methods=['GET'])
def AllOrders():
    Allorders = []
    orders = Orders.query.filter(Orders.OrderStatus != 0).all()
    for order in orders:
        buyer = Buyer.query.filter_by(BuyerLogin=order.BuyerLogin).first()
        inf  ={
            "number" : order.OrderNumber,
            "loginBuyer" : order.BuyerLogin,
            "name" : buyer.BuyerName,
            "status" : order.OrderStatus
        }
        Allorders.append(inf)
    return jsonify(Allorders), 200


@app.route('/productsInAllOrders', methods=['GET'])
def products_in_all_orders():
    order_number = request.args.get('number')

    if order_number is None:
        return jsonify({'error': 'Order number is not provided'}), 400

    try:
        order_number = int(order_number)
    except ValueError:
        return jsonify({'error': 'Invalid order number format'}), 400

    # Теперь у вас есть целочисленное значение order_number, которое вы можете использовать в запросе к базе данных
    # для получения продуктов по этому номеру заказа.

    products = ProductInOrder.query.filter_by(OrderNumber=order_number).all()


    if not products:
        return jsonify({'error': 'No products found for the given order number'}), 404

    result = []
    for product in products:
        name_products = ProductCards.query.filter_by(ItemNumber=product.ItemNumber).first()
        product_info = {
            'ItemNumber': product.ItemNumber,
            'ProductName': name_products.ProductName,
            'OrderNumber': product.OrderNumber,
            'Quantity': product.Quantity,
            'Cost': product.Cost,
            # Добавьте другие поля, которые вам нужны из таблицы ProductInOrder
        }
        result.append(product_info)

    return jsonify(result), 200


@app.route('/placeStatusOrder', methods=['POST'])
def placeStatusOrder():
    data=request.get_json()
    newStatus=Orders.query.filter_by(OrderNumber=data['number']).first()
    newStatus.OrderStatus=int(data['status'])
    db.session.commit()
    return jsonify({'message': 'Order changed status on 1'}), 200


@app.route('/MyOrders', methods=['GET'])
def showMyOrders():
    myOrders = []
    orders = Orders.query.filter(
        Orders.BuyerLogin == session['user_login'],
        Orders.OrderStatus.in_([1, 2, 3])
    ).all()

    for order in orders:
        productsInOrder = []
        products = ProductInOrder.query.filter_by(OrderNumber=order.OrderNumber).all()
        for product in products:
            inf = ProductCards.query.filter_by(ItemNumber=product.ItemNumber).first()
            infoProduct = {
                "id":inf.ItemNumber,
                "image": url_for('static', filename=inf.PhotoProduct),
                "Name": inf.ProductName,
                "Quantity": product.Quantity,
                "Cost": product.Cost
            }
            productsInOrder.append(infoProduct)

        # Форматируем дату в нужный формат "dd.mm.yyyy"
        formatted_date = order.OrderDate.strftime("%d.%m.%Y")

        info = {
            "numberOrder": order.OrderNumber,
            "dateOrder": formatted_date,
            "orderStatus": order.OrderStatus,
            "products": productsInOrder
        }
        myOrders.append(info)

    return jsonify(myOrders), 200


@app.route('/ShowOrder', methods=['GET'])
def ShowOrder():
    card_id = int(request.args.get('id'))
    print(card_id)

    card = ProductCards.query.filter_by(ItemNumber=card_id).first()

    if card:
        order = Orders.query.filter_by(BuyerLogin=session['user_login'], OrderStatus=0).first()

        # Проверяем, есть ли товар в корзине
        in_shopping_card = False
        if order:
            in_shopping_card = ProductInOrder.query.filter_by(OrderNumber=order.OrderNumber, ItemNumber=card.ItemNumber).first()

        # Проверяем, есть ли товар в избранном
        favorite = FavoritesAtBuyer.query.filter_by(BuyerLogin=session['user_login'], ItemNumber=card.ItemNumber).first()

        ShoppingCard = bool(in_shopping_card)


        card_dict = {
                "CaregoryName": card.CaregoryName,
                "ProductName": card.ProductName,
                "ProductDescription": card.ProductDescription,
                "QuantityProductInStock": card.QuantityProductInStock,
                "CostProduct": card.CostProduct,
                "PhotoProduct": url_for('static', filename=card.PhotoProduct),
                "id": card.ItemNumber,
                "inFavorite": bool(favorite),
                "inShoppingCard": ShoppingCard
        }

        return jsonify(card_dict), 200

    # Если товар не найден, вернем пустой словарь
    return jsonify({}), 404


@app.route('/rewiews', methods=['GET'])
def showRewiews():
    # Получаем id товара из параметра запроса
    card_id = request.args.get('id')

    try:
        # Ищем отзывы для указанного товара
        reviews = Feedback.query.filter_by(ItemNumber=card_id).all()

        # Преобразуем результаты в список словарей для удобства JSON-ответа
        reviews_list = [
            {
                'BuyerLogin': review.BuyerLogin,
                'ContentFeedback': review.ContentFeedback,
                'date': review.date.strftime('%d.%m.%Y')  # Форматируем дату в строку
            }
            for review in reviews
        ]

        return jsonify(reviews_list), 200
    except Exception as e:
        # Если произошла ошибка, возвращаем ее в JSON-ответе
        return jsonify({'error': str(e)}), 500

@app.route('/isRewiews', methods=['GET'])
def isRewiews():
    card_id = request.args.get('id')
    rewiew=False
    productsInOrders = ProductInOrder.query.filter_by(ItemNumber=card_id).all()
    for productInOrder in productsInOrders:
        productOrder=Orders.query.filter_by(OrderNumber=productInOrder.OrderNumber).first()
        if productOrder.OrderStatus == 3:
            rewiew=True
            break
    feedback = Feedback.query.filter_by(ItemNumber=card_id, BuyerLogin=session['user_login']).first()
    if feedback:
        f=feedback.ContentFeedback
    else:
        f=" "
    isFeedback={
        'can': rewiew,
        'thereFeedback':f
    }
    return jsonify(isFeedback), 200

@app.route('/newRewiew', methods=['POST'])
def newPewiew():
    try:
        data = request.get_json()
        card_id = data.get('id')
        feedback = data.get('feedback')

        isFeedback = Feedback.query.filter_by(ItemNumber=int(card_id), BuyerLogin=session['user_login']).first()
        if isFeedback:
            isFeedback.ContentFeedback=feedback
        else:
            newFeedback=Feedback(ItemNumber=int(card_id),BuyerLogin=session['user_login'],ContentFeedback=feedback,date=date.today())
            db.session.add(newFeedback)
        db.session.commit()

        # Возвращаем успешный статус
        return jsonify({"message": "Отзыв успешно сохранен"}), 200
    except Exception as e:
        # Обработка ошибок, например, возвращение кода ошибки и сообщения
        return jsonify({"error": str(e)}), 500

@app.route('/profit', methods=['GET'])
def calculate_profit():
    start_date = datetime.fromisoformat(request.args.get('start')).date()
    end_date = datetime.fromisoformat(request.args.get('end')).date()

    profit = db.session.query(
        func.sum(ProductInOrder.Cost).label('all'),
        func.sum(ProductInOrder.Cost * 0.03).label('commission')
    ).join(Orders, ProductInOrder.OrderNumber == Orders.OrderNumber).filter(
        Orders.OrderStatus > 0,
        Orders.OrderDate >= start_date,
        Orders.OrderDate <= end_date
    ).first()

    print(profit)  # Добавьте этот вывод для отладки

    # Проверка на наличие данных перед использованием
    if profit is not None:
        total_profit = float(profit.all) - float(profit.commission)
        return jsonify({'all': profit.all,
                        'commission': round(profit.commission,2),
                        'profit': round(total_profit,2)
                        })
    else:
         return jsonify({
        'all': 0,
        'commission': 0,
        'profit': 0})  # Или другое значение по умолчанию



if __name__ == '__main__':
    app.run(debug=True)