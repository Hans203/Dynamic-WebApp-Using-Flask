from flask import *
from flask_mysqldb import *

app=Flask(__name__)

app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Sarvo@isc12'
app.config['MYSQL_DB'] =  'cloud9'
app.config['MYSQL_HOST'] = 'localhost'
app.config['SECRET_KEY'] = 'supersecretkey123!'
mysql = MySQL(app)

@app.route("/")
def index():
    connection = mysql.connection
    cursor = connection.cursor()
    cursor.execute(f'select * from cars where price>1000000 order by price desc;')
    cars = cursor.fetchall()
    cursor.execute('select * from cars where make = "Rolls-Royce" or make="Bentley" or make ="BMW" order by price desc;')
    luxury = cursor.fetchall()
    cursor.execute(f'select * from brand')
    brand = cursor.fetchall()
    cursor.execute(f'select * from body_type')
    body = cursor.fetchall()
    session['loggedin']=False
    return render_template("index.html", brand=brand, body=body, cars = cars, luxury = luxury)
@app.route("/homepage")
def homepage():
    connection = mysql.connection
    cursor = connection.cursor()
    cursor.execute('select * from cars where make = "Rolls-Royce" or make="Bentley" or make ="BMW" order by price desc;')
    luxury = cursor.fetchall()
    cursor.execute(f'select * from cars where price>1000000 order by price desc;')
    cars = cursor.fetchall()
    cursor.execute(f'select * from brand')
    brand = cursor.fetchall()
    cursor.execute(f'select * from body_type')
    body = cursor.fetchall()
    return render_template("index.html", brand=brand, body=body, cars = cars, luxury = luxury)

@app.route("/signup", methods=['GET', 'POST'])
def signup():
    if request.method=='POST':
        name = request.form['name']
        email = request.form['email']
        username = request.form['username']
        password = request.form['password']
        try:
            connection = mysql.connection
            cursor = connection.cursor()
            cursor.execute("select max(id) from user_info")
            id=cursor.fetchone()[0]+1
            cursor.execute(f'insert into user_info(id, name, username, password, email) values ({id}, "{name}", "{username}", "{password}", "{email}")')
            connection.commit()
            flash("Successfully Signed In")
            return render_template("login.html")
        except Exception as e:
            connection.rollback()
            error_message = str(e)
            if 'username' in error_message:
                flash('Username already exists! Please choose a different username.', "danger")
                return render_template("signup.html")
            elif 'email' in error_message:
                flash('Email already registered! Please use a different email.', "danger")
                return render_template("signup.html")
            else:
                flash('An error occurred during registration. Please try again.', "danger")
                return render_template("signup.html")   
    else:
        return render_template("signup.html")

@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method=="POST":
        username = request.form['username']
        password = request.form['password']
        connection = mysql.connection
        cursor = connection.cursor()
        cursor.execute(f'select username, email from user_info where username="{username}"')
        checkUsername = cursor.fetchone()
        if checkUsername:
            cursor.execute(f'select password from user_info where username="{username}"')
            checkPassword = cursor.fetchone()[0]
            if checkPassword==password:
                session['loggedin'] = True
                session['username'] = username

                return redirect("homepage")
            else:
                flash("Incorrect Password", "danger")
                return render_template("login.html")
        else:
            flash("No username found. Sign Up now to avail our services", "danger")
            return render_template("login.html")
    else:
        return render_template("login.html")
    
@app.route("/logout")
def logout():
    session.pop('loggedin', None)
    session.pop('username', None)
    msg = "Successfully logged out"
    return jsonify(msg)

@app.route("/forgotpas")
def forgotpas():
    connection = mysql.connection
    cursor = connection.cursor()
    
    return render_template("forgotpas.html")

@app.route("/car", methods=['POST', 'GET'])
def cars():
    connection = mysql.connection
    cursor = connection.cursor()
    cursor.execute("select * from brand")
    make = cursor.fetchall()
    cursor.execute("select * from body_type")
    bodytype = cursor.fetchall()
    cursor.execute("select distinct engine_type from cars order by engine_type  desc;")
    engine_type = cursor.fetchall()
    cursor.execute("select concat(c.make, ' ',c.model), model from cars c;")
    searchitems = cursor.fetchall()

    cursor.execute("select * from cars")
    cars = cursor.fetchall()
    return render_template("cars.html", cars=cars, make=make, bodytype = bodytype, engine_type=engine_type, searchitem=searchitems)

@app.route("/display/<model>")
def display(model):
    if session['loggedin']==True:
        connection = mysql.connection
        cursor = connection.cursor()
        cursor.execute("select * from cars")
        cars = cursor.fetchall()
        cursor.execute(f'select * from cars where model = "{model}"')
        car = cursor.fetchone()
        cursor.execute("select concat(c.make, ' ',c.model), model from cars c;")
        searchitems = cursor.fetchall()
        return render_template("display.html", car = car, cars=cars, searchitem=searchitems)
    else:
        return render_template("login.html")

@app.route("/brand/<value>")
def brand(value):
    connection = mysql.connection
    cursor = connection.cursor()
    cursor.execute("select * from brand")
    make = cursor.fetchall()
    cursor.execute("select * from body_type")
    bodytype = cursor.fetchall()
    cursor.execute("select distinct engine_type from cars order by engine_type  desc;")
    engine_type = cursor.fetchall()
    cursor.execute("select concat(c.make, ' ',c.model), model from cars c;")
    searchitems = cursor.fetchall()
    cursor.execute("select * from cars")
    cars = cursor.fetchall()
    return render_template("cars.html", cars=cars, make=make, bodytype = bodytype, engine_type=engine_type, brand=value, searchitems=searchitems)

@app.route("/body/<value>")
def body(value):
    connection = mysql.connection
    cursor = connection.cursor()
    cursor.execute("select * from brand")
    make = cursor.fetchall()
    cursor.execute("select * from body_type")
    bodytype = cursor.fetchall()
    cursor.execute("select distinct engine_type from cars order by engine_type  desc;")
    engine_type = cursor.fetchall()
    cursor.execute("select concat(c.make, ' ',c.model), model from cars c;")
    searchitems = cursor.fetchall()
    cursor.execute("select * from cars")
    cars = cursor.fetchall()
    return render_template("cars.html", cars=cars, make=make, bodytype = bodytype, engine_type=engine_type, body=value, searchitem = searchitems)



@app.route('/filter-cars', methods=['POST'])
def filter_content():
    data = request.get_json()
    print(data)
    brand = data['filters']['brand']
    body_types = data['filters']['body_type']
    engine_type = data['filters']['engine_size']
    min_price = data['filters']['price_range']['min']
    max_price = data['filters']['price_range']['max']
    speed  = data['filters']['speed']
    
    
    connection = mysql.connection
    cursor = connection.cursor()
    query = "SELECT * FROM cars WHERE 1=1"
    if brand:
        brand_str = ','.join([f"'{br}'"for br in brand])
        query+= f' and make in ({brand_str})'
    if body_types:
        body_type_string = ','.join([f"'{bt}'" for bt in body_types])
        query += f" AND bodytype IN ({body_type_string})"
    if engine_type:
        engine_typestr = ','.join([f"'{et}'" for et in engine_type])
        query += f" AND engine_type in ({engine_typestr})"
    if min_price and max_price:
        query += f" AND price BETWEEN {min_price} AND {max_price}"
    if speed:
        query+= f" and zerosixty <={speed}"
    cursor.execute(query)
    cars = cursor.fetchall()
    return jsonify(cars)

@app.route("/garage", methods=["POST", "GET"])
def garage():
    if session['loggedin']==True:
        connection = mysql.connection
        cursor = connection.cursor()
        if request.method=="POST":
            data=request.get_json()
            cursor.execute(f'select id from user_info where username = "{session["username"]}"')
            id=cursor.fetchone()[0]
            cursor.execute(f'select * from garage where user_id = {id}')
            garagedata = cursor.fetchall()
            cart=[]
            for i in garagedata:
                cart.append(i[1])
            print(data['value'])
            if int(data['value']) in cart:
                cursor.execute(f'delete from garage where cart="{data["value"]}"')
                connection.commit()
                return jsonify({'message': "Removed from Garage"}, {'buttValue':'Add To garage'})
            else:
                cursor.execute(f'insert into garage(user_id, cart) values({id}, {int(data["value"])})')
                connection.commit()
                return jsonify({"message":"Successfully added to Garage."}, {'buttValue':'Remove from Garage'})
        else:
            
            cursor.execute("select concat(c.make, ' ',c.model), model from cars c;")
            searchitems = cursor.fetchall()
            cursor.execute(f'select id from user_info where username = "{session["username"]}"')
            id=cursor.fetchone()[0]
            cursor.execute(f'select * from garage where user_id = {id}')
            garagedata = cursor.fetchall()
            cart=[]
            for i in garagedata:
                cart.append(i[1])
            cart = [i[1] for i in garagedata]
            if cart:
                cart_str = str(tuple(cart))
                if len(cart) == 1:
                    cart_str = f"({cart[0]})"
                cursor.execute(f'select * from cars where id in {cart_str}')
                cars = cursor.fetchall()
            else:
                cars=[]
            return render_template("garage.html", cars=cars, searchitem=searchitems)
    else:
        return render_template("login.html")
@app.route("/gallery")
def gallary():
    connection = mysql.connection
    cursor = connection.cursor()
    cursor.execute(f'select carimage1, carimage2, carimage3 from cars')
    images = cursor.fetchall()
    return render_template("gallery.html", images=images)
@app.route("/addtogarage", methods=['POST', 'GET'])
def addtogarage():
    data=request.get_json()
    connection = mysql.connection
    cursor = connection.cursor()
    cursor.execute(f'select id from user_info where username = "{session["username"]}"')
    id=cursor.fetchone()[0]
    cursor.execute(f'select * from garage where user_id = {id}')
    garagedata = cursor.fetchall()
    cart=[]
    print(data['value'])
    for i in garagedata:
        cart.append(i[1])
    print(cart)
    if int(data['value']) in cart:
        return jsonify({'message': 'Remove from Garage'})
    else:
        return jsonify({'message': 'Add To Garage'})

@app.route("/remove-car", methods=['POST', 'GET'])
def removecar():
    data=request.get_json()
    connection = mysql.connection
    cursor = connection.cursor()
    cursor.execute(f'delete from garage where cart={data["car_id"]}')
    connection.commit()
    return jsonify({'message': 'Removed from Garage'})


@app.route("/aboutus")
def aboutus():
    return render_template("about.html")

@app.route("/buy/<model>")
def buycar(model):
    if session['loggedin']==True:
        connection = mysql.connection
        cursor = connection.cursor()
        cursor.execute(f'select * from user_info where username = "{session["username"]}"')
        user_info = cursor.fetchone()
        cursor.execute(f'select * from cars where model = "{model}"')
        car = cursor.fetchone()
        cursor.execute("select concat(c.make, ' ',c.model), model from cars c;")
        searchitems = cursor.fetchall()
        vat = (20/100)*int(car[9])
        totalprice = vat+car[9]
        return render_template("buycar.html", car = car, searchitem=searchitems, vat = vat, tp = totalprice, user_info = user_info)
    else:
        return render_template("login.html")

@app.route("/payment", methods = ['POST', 'GET'])
def payment():
    if session['loggedin']==True:
        connection = mysql.connection
        cursor = connection.cursor()
        cursor.execute(f'select id from user_info where username = "{session["username"]}"')
        userid = cursor.fetchone()[0]
        cursor.execute("select concat(c.make, ' ',c.model), model from cars c;")
        searchitems = cursor.fetchall()
        if request.method=='POST':
            carid = int(request.form['carid'])
            totalPrice = float(request.form['tp'])
            street = request.form['street']
            city = request.form['city']
            state = request.form['state']
            postal = request.form['postal']
            country = request.form['country']
            paymethod = request.form['payment']
            if paymethod=='debitCard':
                cardholderName = request.form['cardholderName']
                cardNumber = request.form['cardNumber']
                expiry = request.form['expiryDate']
                cvv = request.form['cvv']
                cursor.execute(f'insert into payment(user_id, car_id, price, street, city, state, postal_code, country, payment_method) values ({userid},{carid},{totalPrice}, "{street}","{city}","{state}","{postal}","{country}","{paymethod}")')
                connection.commit()
                flash("Payment Successfull", "success")
                cursor.execute(f'select c.make,c.model, c.carimage1, p.* from cars c inner join payment p on  c.id = p.car_id where user_id={userid};')
                cars=cursor.fetchall()
                return render_template("confirmpay.html", car=cars, searchitem=searchitems)
            else:
                cursor.execute(f'insert into payment(user_id, car_id, price, street, city, state, postal_code, country, payment_method)values ({userid},{carid},{totalPrice}, "{street}","{city}","{state}","{postal}","{country}","{paymethod}")')
                connection.commit()
                flash("Payment Successfull", "success")
                cursor.execute(f'select c.make,c.model, c.carimage1, p.* from cars c inner join payment p on  c.id = p.car_id where user_id={userid};')
                cars=cursor.fetchall()
                return render_template("confirmpay.html", car=cars, searchitem=searchitems)
        else:
            cursor.execute(f'select c.make,c.model, c.carimage1, p.* from cars c inner join payment p on  c.id = p.car_id where user_id={userid};')
            cars=cursor.fetchall()
            return render_template("confirmpay.html", car=cars, searchitem=searchitems)
    else:
        return render_template("login.html")

app.run(debug = True)


