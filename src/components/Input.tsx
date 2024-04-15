
import { colors } from "@/styles/colors";
import { ReactNode } from "react";
import { TextInput, TextInputProps, View } from "react-native";

function Input({children}:{children:ReactNode}) {
  return (
   <View className="w-full h-16 flex-row items-center gap-3 border border-green-400 rounded-lg p-3">
    {children}
   </View>
  )
}


function Field({...rest}:TextInputProps) {
  return <TextInput
  className="flex-1 text-white text-base font-regular p-2"
  placeholderTextColor={colors.gray[200]}
  {...rest} 
   />
}

Input.Field = Field

export {Input}