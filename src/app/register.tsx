import { Input } from '@/components/Input'
import { Alert, Image, StatusBar, View } from 'react-native'
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons'
import { colors } from '@/styles/colors'
import { Button } from '@/components/Button'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { api } from '@/server/api'
import axios from 'axios'
import { useBadgeStore } from '@/store/badge-store'

interface IUser {
  name: string
  email: string
}
// asovitorio@gmail.com
//Alessandro Barbosa Vitorio
export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const EVENT_ID = '9e9bd979-9d10-4915-b339-3786b1634f33'
  async function handleRegister() {
    try {
      if (!name.trim() || !email.trim()) {
        Alert.alert('Formulário', 'Preencha todos os campos')
        return
      }
      setIsLoading(true)
      
      const response = await api.post(`/events/${EVENT_ID}/attendees`, {
        name,
        email,
      })
      
      
    
      
      if (response.data.attendeeId) {
        const badResponse = await api.get(`/attendees/${response.data.attendeeId}/badge`)
        Alert.alert('Inscrição', 'Inscrição realizada com sucesso!', [
          {
            text: 'OK',
            onPress: () => router.push('/ticket'),
          },
        ])
       const badgeStore =  useBadgeStore()
      return badgeStore.save(badResponse.data.badge)
      }
    } catch (error) {
      setIsLoading(false)
      if (axios.isAxiosError(error)) {
        if (
          String(error.response?.data.message).includes('already registered')
        ) {
          return Alert.alert('Inscrição', 'Este email já foi cadastrado!')
        }
        Alert.alert('Inscrição', 'Não foi possive cadastrar a inscrição!')
      }
    }
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
          <FontAwesome6 name="user-circle" size={20} color={colors.gray[200]} />
          <Input.Field placeholder="Nome completo" onChangeText={setName} value={name}/>
        </Input>
        <Input>
          <MaterialIcons
            name="alternate-email"
            size={20}
            color={colors.gray[200]}
          />

          <Input.Field
            placeholder="E-mail"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
          />
        </Input>
        <Button
          title="Acessar Credencial"
          isLoading={isLoading}
          onPress={handleRegister}
        />
        <Link href="/" className="text-gray-100 font-bold text-center mt-8">
          Já possui ingresso?
        </Link>
      </View>
    </View>
  )
}
