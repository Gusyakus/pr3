
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import userData from "../assets/data/UserData.json";


export default function UserProfileScreen({ userId, onUpdate }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  const fetchUserProfile = async () => {
    setLoading(true);
    const response = await fetch(`https://api.example.com/users/${userId}`);
    const data = await response.json();
    setProfile(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserProfile();
  }, );

  const handleSaveProfile = async () => {
    const updatedData = {
      name: editedName,
      email: editedEmail,
    };

    const response = await fetch(`https://api.example.com/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    const result = await response.json();
    setProfile(result);
    setIsEditing(false);
    onUpdate && onUpdate(result);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (err) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{err}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centerContainer}>
        <Text>Профиль не найден</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Шапка профиля */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Мой профиль</Text>
      </View>

      {/* Основная информация */}
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Основная информация</Text>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Имя:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Введите имя"
            />
          ) : (
            <Text style={styles.value}>{profile.name}</Text>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Email:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedEmail}
              onChangeText={setEditedEmail}
              placeholder="Введите email"
            />
          ) : (
            <Text style={styles.value}>{profile.email}</Text>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Дата регистрации:</Text>
          <Text style={styles.value}>{profile.createdAt}</Text>
        </View>
      </View>

      {/* Кнопки действия */}
      <View style={styles.buttonContainer}>
        {!isEditing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setIsEditing(true);
              setEditedName(profile.name);
              setEditedEmail(profile.email);
            }}
          >
            <Text style={styles.buttonText}>Редактировать</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.buttonText}>Сохранить</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Отмена</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#007AFF",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  profileSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  editButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: "#34C759",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
  },
});
