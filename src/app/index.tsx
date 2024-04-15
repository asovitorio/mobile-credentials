import { Input } from '@/components/Input'
import { Alert, Image, StatusBar, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '@/styles/colors'
import { Button } from '@/components/Button'
import { Link, router,Redirect } from 'expo-router'
import { useState } from 'react'
import { api } from '@/server/api'
import { useBadgeStore } from '@/store/badge-store'

export default function Home() {
  const [code, setCode] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const badgeStore = useBadgeStore()


  async function handleAccessCredential() {
    try {
      if (!code.trim()) {
        return Alert.alert('Credencial', 'Digite um codigo do ingresso!')
      }
      setIsLoading(true)

      const { data } = await api.get(`/attendees/${code}/badge`)
      
      
      badgeStore.save(data.badge)
     
      router.push({
        pathname: '/ticket',
        params: {
          ...data.badge,
        },
      })
    } catch (error) {
      console.log(error)

      setIsLoading(true)
    }
  }
  if (badgeStore.data?.checkInURL) {
    return <Redirect href={"/ticket"} />
  }
  return (
    <View className="flex-1 bg-green-500 justify-center items-center p-8">
      <StatusBar barStyle="light-content" />

      <Image
        source={require('@/assets/logo.png')}
        className="h-16"
        resizeMode="contain"
      />
      <View className="w-full mt-12 gap-3">
        <Input>
          <MaterialCommunityIcons
            name="ticket-confirmation-outline"
            size={20}
            color={colors.gray[200]}
          />
          <Input.Field placeholder="codigo de acesso" onChangeText={setCode} />
        </Input>
        <Button
          title="Acessar Credencial"
          isLoading={isLoading}
          onPress={handleAccessCredential}
        />
        <Link
          href="/register"
          className="text-gray-100 font-bold text-center mt-8"
        >
          Ainda não possui ingresso?
        </Link>
      </View>
    </View>
  )
}
