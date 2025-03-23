import os
import pickle
import numpy as np
import librosa
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Set local file paths
scaler_path = r'C:\\Users\\RaghavaConstructions\\Desktop\\project\\backend\\models\\scalar_155_00.pkl'
model_path = r'C:\\Users\\RaghavaConstructions\\Desktop\\project\\backend\\models\\model_155_00.h5'

# Load the dataset
features_df = pd.read_csv(r'C:\\Users\\RaghavaConstructions\\Desktop\\project\\backend\\models\\features.csv')

# Split features and target
X = features_df.iloc[:, :-1].values  # 155 features
y = features_df.iloc[:, -1].values   # Target labels

# Standardize the features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Save the scaler
joblib.dump(scaler, scaler_path)
print(f"Scaler saved successfully to {scaler_path}.")

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Save the model
joblib.dump(model, model_path)
print(f"Model saved successfully to {model_path}.")

# Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS for React integration

# Load model and scaler
try:
    model = joblib.load(model_path)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

try:
    scaler = joblib.load(scaler_path)
    print("Scaler loaded successfully.")
except Exception as e:
    print(f"Error loading scaler: {e}")
    scaler = None

# Feature extraction functions
def extract_features(data, sr=22050, n_mfcc=40):
    result = np.array([])

    # Extracting various features (we will ensure only 155 features are used)
    zcr = np.mean(librosa.feature.zero_crossing_rate(y=data).T, axis=0)
    result = np.hstack((result, zcr))

    stft = np.abs(librosa.stft(data))
    chroma = np.mean(librosa.feature.chroma_stft(S=stft, sr=sr).T, axis=0)
    result = np.hstack((result, chroma))

    mfcc = np.mean(librosa.feature.mfcc(y=data, sr=sr, n_mfcc=n_mfcc).T, axis=0)
    result = np.hstack((result, mfcc))

    rms = np.mean(librosa.feature.rms(y=data).T, axis=0)
    result = np.hstack((result, rms))

    mel = np.mean(librosa.feature.melspectrogram(y=data, sr=sr).T, axis=0)
    result = np.hstack((result, mel))

    # Ensure only 155 features are returned
    result = result[:155]
    return result

def get_features(path, n_mfcc=40):
    data, sample_rate = librosa.load(path, duration=2.5, offset=0.6)
    res1 = extract_features(data, sr=sample_rate, n_mfcc=n_mfcc)
    return np.array(res1).reshape(1, -1)  # Reshape for scaler compatibility

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if not file or not file.filename.endswith('.wav'):
        return jsonify({'error': 'Only WAV files are supported'}), 400

    file_path = os.path.join('uploads', file.filename)
    os.makedirs('uploads', exist_ok=True)
    file.save(file_path)

    try:
        features = get_features(file_path, n_mfcc=40)
        scaled_features = scaler.transform(features)

        prediction_probs = model.predict_proba(scaled_features)
        prediction = model.predict(scaled_features)

        # Log prediction and probabilities for debugging
        print("Predicted label:", prediction[0])
        print("Prediction probabilities:", prediction_probs)

        # Use string-based label mapping if needed
        label_map = {'happy': 'happy', 'sad': 'sad', 'angry': 'angry', 
                     'neutral': 'neutral', 'surprised': 'surprised', 'fearful': 'fearful'}
        
        # Check if prediction[0] matches a key in label_map
        emotion_label = label_map.get(prediction[0], 'unknown')

        confidence = np.max(prediction_probs)  # Maximum probability as confidence

        # Log final response for debugging
        response = {'emotion': emotion_label, 'confidence': float(confidence)}
        print("Backend response:", response)

        return jsonify(response)

    except Exception as e:
        print(f"Error processing the file: {str(e)}")  # Print the error to the terminal for debugging
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    app.run(debug=True)
