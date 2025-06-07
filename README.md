# HolidayHawk

🛍️ Holiday Sales Prediction with Weather Impact: A Time Series Approach
This project focuses on forecasting retail sales during holiday seasons by incorporating the influence of external weather and economic factors. Leveraging machine learning and time series models like Random Forest, ARIMA,SARIMAX, it uses Walmart's historical weekly sales data enriched with features such as temperature, fuel prices, CPI, and unemployment rates.

Goal:
Forecast retail sales with improved accuracy using machine learning, particularly during holiday periods when consumer behavior is volatile.

Core Features:

Exploratory data analysis (EDA) and trend visualization

ADF test to assess stationarity

Feature engineering using temporal and economic variables

Scaling and preprocessing of numerical features

Forecasting using different models and selecting best amomg them ,here the final model used( Random Forest Regressor)

Error metric: Mean Absolute Error (MAE)

Visualization of actual vs predicted sales


📊 Dataset
Source: Provided internally as Walmart.csv

Important Columns:

Weekly_Sales — Target sales variable

Date — Weekly timestamp

Temperature, Fuel_Price, CPI, Unemployment — External influencing features


🧠 Modeling Approach
Final Model: ✅ Random Forest Regressor

Previous Experiments: SARIMAX with exogenous variables

Feature Set:

Weather and economic indicators

Temporal variables: year, month, week number, day of week


⚙️ Technologies Used
Python 3.12

Streamlit – for interactive web-based dashboard and deployment

pandas, numpy – for data manipulation and preprocessing

matplotlib, seaborn – for data visualization

scikit-learn – for implementing the Random Forest Regressor, performance metrics, and scaling

statsmodels – used only for ADF stationarity testing


▶️ How to Run

pip install -r requirements.txt
streamlit run app.py

