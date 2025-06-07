from flask import Flask, request, jsonify, render_template
import pandas as pd
import joblib

app = Flask(__name__)

model = joblib.load("holiday_sales3_model.pkl")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/forecast', methods=['POST'])
def forecast():
    data = request.get_json()
    
    start_date = datetime.strptime(data['start_date'], '%Y-%m-%d')
    num_weeks = int(data['weeks'])
    
    end_date = start_date + timedelta(days=(num_weeks * 7) - 1)
    
    temperature = float(data['temperature'])
    fuel_price = float(data['fuel_price'])
    cpi = float(data['cpi'])
    unemployment = float(data['unemployment'])
    holiday_flag = int(data['holiday_flag'])
    
    date_range = [start_date + timedelta(days=i) for i in range((end_date - start_date).days + 1)]
    
    forecasts = []
    for date in date_range:
        input_data = pd.DataFrame([{
            'Temperature': temperature,
            'Fuel_Price': fuel_price,
            'CPI': cpi,
            'Unemployment': unemployment,
            'Holiday_Flag': holiday_flag,
        }])
        
        forecast_value = model.predict(input_data)[0]
        
        formatted_date = date.strftime('%b %d, %Y')
        
        forecasts.append({
            'date': formatted_date,
            'day': date.strftime('%A'),
            'sales': round(float(forecast_value), 2)
        })
    
    return jsonify({
        'forecasts': forecasts
    })

if __name__ == '__main__':
    app.run(debug=True)
