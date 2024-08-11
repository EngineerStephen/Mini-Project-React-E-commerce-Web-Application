from flask import Flask, request, jsonify 
from flask_marshmallow import Marshmallow 
from marshmallow import fields, ValidationError 
from connection import connect_db
from mysql.connector import Error
from flask_cors import CORS




app = Flask(__name__)
ma = Marshmallow(app) 
CORS(app)
@app.route("/")
def home():
    return "<h1>Welcome to my E-Commerce Application</h1>"
@app.route("/about")
def about():
    return "<h3>Welcome to my E-Commerce Application, You can manage your database Successfully </h3>"



class CustomerSchema(ma.Schema):

    name = fields.String(required=True)
    email = fields.String(required=True)
    phone = fields.String(required=True) 

    class Meta:
        
        fields = ("name", "email", "phone", "customer_id")

customer_schema = CustomerSchema()
customers_schema = CustomerSchema(many=True) 


# ============================================ SCHEMA AND ROUTES FOR CUSTOMERS ================================================ 
@app.route('/customers', methods=["GET"])
def get_customers():

    conn = connect_db()
    cursor = conn.cursor(dictionary=True) 
    query = "SELECT * FROM Customers"

    cursor.execute(query)

    customers = cursor.fetchall()
    print(customers)

    cursor.close()    
    conn.close()


    return customers_schema.jsonify(customers) 

@app.route('/customers', methods=["POST"])
def add_customer():
    try: 
        customer_data = customer_schema.load(request.json)
        print(request.json, "JSON DATA FROM REQUEST")
        print(customer_data, "CUSTOMER DATA")
    except ValidationError as e:
        print(f"Error: {e}")
        return jsonify(e.messages), 400
    
    try:
        conn = connect_db()
        if conn is None:
            return jsonify({"error": "Database connection failed."}), 500
        
        cursor = conn.cursor()
        name = customer_data['name']
        print(name)
        email = customer_data['email']
        print(email)
        phone = customer_data['phone']
        print(phone)

        new_customer = (name, email, phone)

        query = "INSERT INTO Customers(name, email, phone) VALUES(%s, %s, %s)"


        cursor.execute(query, new_customer)
        conn.commit()

        return jsonify({"message": "New customer added successfully"}), 201 
    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/customers/<int:id>', methods = ["PUT"]) 
def update_customer(id):
    try: 
    
        customer_data = customer_schema.load(request.json)
        print(customer_data)
    except ValidationError as e:
        print(f"Error: {e}")
        return jsonify(e.messages), 400
    
    try:
        conn = connect_db()
        if conn is None:
            return jsonify({"error": "Database Connection Failed"}), 500
        
        cursor = conn.cursor()

        name = customer_data['name']
        email = customer_data['email']
        phone = customer_data['phone']
        #                                    
        updated_customer = (name, email, phone, id)


        query = "UPDATE Customers SET name = %s, email = %s, phone = %s WHERE customer_id = %s"


        cursor.execute(query, updated_customer)
        conn.commit()


        return jsonify({"message": "Customer details updated successfully"}), 200
    
    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
    finally:

        if conn and conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/customers/<int:id>', methods = ["DELETE"])
def delete_customer(id):
    try:
        conn = connect_db()
        if conn is None:
            return jsonify({"message": "Database connection failed"}), 500
        cursor = conn.cursor()
        customer_to_remove = (id,)


        query = "SELECT * FROM Customers WHERE customer_id = %s"
        cursor.execute(query, customer_to_remove)
        customer = cursor.fetchone()
        print(customer)
        if not customer:
            return jsonify({"message": "Customer not found"}), 404
        

        query = "SELECT * FROM Orders WHERE customer_id = %s"
        cursor.execute(query, customer_to_remove)

        customer_orders = cursor.fetchall()

        if customer_orders:
            return jsonify({"message": "Cannot delete customer with associated orders. "}), 403 #FORBID the user from deleting a customer with orders
        

        query = "DELETE FROM Customers WHERE customer_id = %s"
        cursor.execute(query, customer_to_remove)
        conn.commit()

        return jsonify({"message": "Customer removed successfully"}), 200

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

# ============================================ SCHEMA AND ROUTES FOR ORDERS ================================================


class OrderSchema(ma.Schema):
    order_id = fields.Int(dump_only=True)
    customer_id = fields.Int(required=True)
    date = fields.Date(required=True)

    class Meta:

        fields = ("order_id", "customer_id", "date")

order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)

@app.route("/orders", methods=["GET"])
def get_orders():
    try:
        conn = connect_db()
        if conn is None:
            return jsonify({"message": "Database connection failed"}), 500
        
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM Orders"
        cursor.execute(query)

        orders = cursor.fetchall()
        example = cursor.fetchone()
        print(example, "EXAMPLE OF FETCHONE")
        
        return orders_schema.jsonify(orders)
        return jsonify({"error": "Internal Server Error"}), 500
    
    finally:

        if conn and conn.is_connected():
            cursor.close()
            conn.close()

@app.route("/orders", methods = ["POST"])
def add_order():

    try:

        order_data = order_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    try:
        conn = connect_db()
        if conn is None:
            return jsonify({"message": "Database connection failed"}), 500
        
        cursor = conn.cursor()

        query = "INSERT INTO Orders (date, customer_id) VALUES (%s, %s)"
        new_order = (order_data['date'], order_data['customer_id'])
        cursor.execute(query, new_order)
        conn.commit()

        return jsonify({"message": "Order added successfully"}), 201
        
    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
    finally:

        if conn and conn.is_connected():
            cursor.close()
            conn.close()
    

@app.route("/orders/<int:order_id>", methods=["PUT"])
def update_order(order_id):
    try:

        order_data = order_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    try:
        conn = connect_db()
        if conn is None:
            return jsonify({"message": "Database connection failed"}), 500
        
        cursor = conn.cursor()
        query = "UPDATE Orders SET date = %s, customer_id = %s WHERE order_id = %s"
        
        update_order = (order_data['date'], order_data['customer_id'], order_id)

        cursor.execute(query, update_order)
        conn.commit()

        return jsonify({"message": "Order was successfully updated!"}), 200



    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()


@app.route('/orders/<int:order_id>', methods = ["DELETE"])
def delete_order(order_id):
    try:
        conn = connect_db()
        if conn is None:
            return jsonify({"message": "Database connection failed"}), 500
        cursor = conn.cursor()
        order_to_remove = (order_id,)

        query = "SELECT * FROM Orders WHERE order_id = %s"
        cursor.execute(query, order_to_remove)


        order = cursor.fetchone()
        print(order, "example of fetchone")
        if not order: 
            return jsonify({"message": "Order does not exist"}), 404
        
        query = "DELETE FROM Orders WHERE order_id = %s"
        cursor.execute(query, order_to_remove)
        conn.commit()

        return jsonify({"message": "Order deleted successfully!"})

    

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()



class ProductSchema(ma.Schema):
    product_id = fields.Int(dump_only=True)
    name = fields.String(required=True)
    price = fields.Float(required=True)
    stock = fields.Int(required=True)

    class Meta:
        fields = ("product_id", "name", "price", "stock")

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)

@app.route("/products", methods=["GET"])
def get_products():
    try:
        conn = connect_db()
        if conn is None:
            return jsonify({"message": "Database connection failed"}), 500
        
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM Products"
        cursor.execute(query)
        products = cursor.fetchall()
        return products_schema.jsonify(products)
    except Error as e:
        return jsonify({"error": "Internal Server Error"}), 500
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()
            
            
@app.route("/products/<int:id>", methods=["GET"])
def get_product_by_id(id):
    try:
        conn = connect_db()
        if conn is None:
            return jsonify({"message": "Database connection failed"}), 500
        
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM Products WHERE product_id = %s"
        cursor.execute(query, (id,))
        product = cursor.fetchone()

        if not product:
            return jsonify({"message": "Product not found"}), 404

        return product_schema.jsonify(product)
    except Error as e:
        return jsonify({"error": "Internal Server Error"}), 500
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()





if __name__ == "__main__":
    app.run(debug=True)