import React from "react";
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import FilledBtn from "./RequestOrder/FilledBtn";
import UnfilledBtn from "./UnfilledBtn";
import BurgerImg from "../assets/burgerImg.png";
import HandImg from "../assets/hand.png";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function AddOne() {
  const navigation = useNavigation();
  const route = useRoute();

  const { image } = route.params;

  return (
    <SafeAreaView style={styles.contentContainer}>
      <View style={styles.addOneContainer}>
        <Image
          resizeMode="contain"
          style={styles.imageSize}
          source={image ? { uri: image } : BurgerImg}
        />
      </View>
      <View style={styles.handImgContainer}>
        <Image style={styles.handImgSize} source={HandImg} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.heading}>أضفت بنجاح، نشكر طيب كرمك</Text>
        {/* <Text style={styles.description}>
          تم الشاقة العربي الناس ولا بنجاح يمكنك الآن التقيم الطالبات في الرسائل
          سارع
        </Text>

        <Text style={{ ...styles.description, marginTop: 2 }}>
          {" "}
          بقول العقبات التي شلال التحقيق الهدف بنواح
        </Text>
        <Text style={{ ...styles.description, marginTop: 10 }}>
          نشكر ونقدر كرمك، ومساهمتك في نشر الخير
        </Text>
        <Text
          style={{ ...styles.description, marginTop: 20, marginBottom: 30 }}
        >
          يمكنك متابعة الطلبات والعروض الخاصة بك من خلال القوائم
        </Text> */}
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btnContainer1}
          onPress={() => navigation.navigate("Promise")}
        >
          <Text style={styles.btnText1}>القوائم</Text>
        </TouchableOpacity>
        <View style={{ margin: 5 }} />
        <UnfilledBtn
          title="الرئيسية"
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Tabs" }],
            })
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  addOneContainer: {
    backgroundColor: "#B99C28",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  imageSize: {
    height: 180,
    width: 220,
  },
  handImgSize: {
    height: 60,
    width: 60,
  },
  handImgContainer: {
    height: 80,
    width: 80,
    borderRadius: 200,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#DCF5EE",
    marginVertical: 20,
  },
  heading: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#3E4E5F",
    fontSize: 20,
  },
  description: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 12,
  },
  textContainer: {
    marginHorizontal: 20,
  },
  btnContainer: {
    marginHorizontal: 20,
  },
  btnContainer1: {
    backgroundColor: "#B99C28",
    borderRadius: 10,
    marginTop: 30,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText1: {
    color: "white",
    textAlign: "center",
  },
});
