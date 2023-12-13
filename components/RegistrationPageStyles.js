import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 600,
    height: 250,
    alignSelf: "center",
  },
  header: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#515C5D",
  },
  form: {
    marginBottom: 20,
  },

  field: {
    position: "relative",
    width: "100%",
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
    borderColor: "#ccc",
    borderRadius: 11,
    borderWidth: 1,
    marginBottom: 20,
    marginRight: 3,
    paddingLeft: 20,
    gap: 10,
    height: 50,
    color: "#515C5D",
  },

  label: {
    textAlign: "right",
    marginBottom: 5,
    color: "#515C5D",
  },
  input: {
    width: "50%",
    textAlign: "right",
    color: "#515C5D",
  },
  endEndorment: {
    height: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    overflow: "hidden",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    gap: 5,
    paddingHorizontal: 20,
    color: "#515C5D",
  },
  radioGroup: {
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 30,
  },
});

export default styles;
