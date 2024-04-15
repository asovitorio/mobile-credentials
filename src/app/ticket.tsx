import { Button } from '@/components/Button'
import Credential from '@/components/Credential'
import { Header } from '@/components/header'
import { colors } from '@/styles/colors'
import { FontAwesome } from '@expo/vector-icons'
import { Redirect } from 'expo-router'
import { useState } from 'react'
import {
  StatusBar,
  Text,
  View,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  Share,
} from 'react-native'
import { MotiView } from 'moti'
import * as ImagePicker from 'expo-image-picker'
import { Qrcode } from '@/components/Qrcode'
import { useBadgeStore } from '@/store/badge-store'
export default function Ticket() {
  const [expandQrcode, setExpandQrcode] = useState<boolean>(false)

  const badgeStore = useBadgeStore()

  async function handleSelectImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
      })
      if (result.assets) {
        badgeStore.updateAvatar(String(result.assets[0].uri))
      }
    } catch (error) {
      console.log(error)
      Alert.alert('Foto', 'Não foi possível selecionar a image')
    }
  }

  async function handleShare() {
    try {
      if (badgeStore.data?.checkInURL) {
        await Share.share({ message: badgeStore.data.checkInURL })
      }
    } catch (error) {
      console.log(error)
      Alert.alert('Compartihar ⚠', 'Não foi possível compartihar!')
    }
  }

  if (!badgeStore.data?.checkInURL) {
    return <Redirect href="/" />
  }
  return (
    <View className="flex-1 bg-green-500 ">
      <StatusBar barStyle="light-content" />
      <Header title="Minha Credencial" />
      <ScrollView
        className="-mt-28 -z-10"
        contentContainerClassName="px-8 pb-8"
      >
        <Credential
          onChangeAvatar={handleSelectImage}
          onShowQrcode={() => setExpandQrcode(true)}
          data={badgeStore.data}
        />
        <MotiView
        from={{translateY:0}}
        animate={{translateY:10}}
        transition={{
          loop:true,
          type:"timing",
          duration:700
        }}
        >
          <FontAwesome
            name="angle-double-down"
            size={24}
            className="self-center "
            color={colors.gray[300]}
          />
        </MotiView>

        <Text className="text-white font-bold text-2xl mt-4 ">
          Compartilhar credencial
        </Text>
        <Text className="text-white font-regular text-base mt-1 mb-6 ">
          Mostre ao mundo que você vai participar do evento{' '}
          {badgeStore.data.eventTitle}
        </Text>
        <Button title="Compartilhar" onPress={handleShare} />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => badgeStore.remove()}
          className="justify-center items-center"
        >
          <Text className="font-body text-white text-sm font-bold mt-10">
            Remover Ingresso
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal visible={expandQrcode} statusBarTranslucent animationType="slide">
        <View className="flex-1 bg-green-500 items-center justify-center ">
          <Qrcode size={350} value={badgeStore.data.checkInURL} />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setExpandQrcode(false)}
          >
            <Text className="font-body text-orange-500 text-sm font-bold mt-10">
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}
