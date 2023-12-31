import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default [
  {
    id: "1",
    title: "في أكرِمها نحن جسد واحد",
    description:
      "حسنوا حياتكم المادية والمعنوية ، إبحث واعثر على أقرب الأطعمة المناسبة لك.",
    image: require("../assets/firstBoard3.png"),
  },

  {
    id: "2",
    title: "إلحق بِركب شاكري النعم",
    description:
      "في أكرِمها مشاركتك تعزز الروابط الأخوية بين فئات المجتمع حدد وشارك نوع زوائد الطعام الذي تود التبرع به",
    image: require("../assets/secondBoard3.png"),
  },

  {
    id: "3",
    title: "المتبرع والمستفيد معًا في شكر النعمة",
    description:
      "كونوا ممن تعاونوا على البر والتقوى              #أكرمها لتدوم",
    image: require("../assets/thirdBoard2.png"),
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
