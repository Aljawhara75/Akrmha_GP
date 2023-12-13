import React from "react";
import { Text, View, FlatList } from "react-native";
import CustomerList from "./CustomerList";

export default function AcceptOrderComp({ customers, setStateUpdate, donerInfo }) {

  return (
    <View>
      <FlatList
        data={customers.map(customer => ({ ...customer }))}
        renderItem={({ item, index }) => (
          <CustomerList customer={item} index={index} setStateUpdate={setStateUpdate} ownerName={donerInfo} />
        )}
        ListEmptyComponent={
          () => {
            <View>
              <Text style={{ textAlign: "right" }}>لم يتم العثور على البيانات</Text>
            </View>
          }
        }
      />
    </View>
  );
}

