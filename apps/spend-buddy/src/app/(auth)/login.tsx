import { TextInput, View } from 'react-native'

import { Button, Input, Screen } from '~/components/ui'
import { useLoginMutation } from '~/features/auth/hooks'
import { useRefs } from '~/hooks'
import { Controller, useForm, z, zodResolver } from '~/lib/hook-form'

export default function LoginScreen() {
  const { mutate, isPending } = useLoginMutation()

  return (
    <Screen loading={isPending}>
      <LoginForm loading={isPending} onSubmit={mutate} />
    </Screen>
  )
}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type FormFields = z.infer<typeof formSchema>

function LoginForm(props: { loading?: boolean; onSubmit(data: FormFields): void }) {
  const [emailRef, passwordRef] = useRefs<TextInput | null>(null)
  const { control, handleSubmit, getValues } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  })

  return (
    <View className='gap-6'>
      <Controller
        control={control}
        name='email'
        render={({ field, fieldState }) => (
          <Input.Email
            ref={emailRef}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            label='Email'
            errorMessage={fieldState.error?.message}
            blurOnSubmit={false}
            autoCapitalize='none'
            returnKeyType='next'
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
        )}
      />
      <Controller
        control={control}
        name='password'
        render={({ field, fieldState }) => (
          <Input.Secure
            ref={passwordRef}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            label='Password'
            icon='key'
            errorMessage={fieldState.error?.message}
            autoComplete='current-password'
            returnKeyType='done'
            onSubmitEditing={() => {
              getValues('email').length ? handleSubmit(props.onSubmit) : emailRef.current?.focus()
            }}
          />
        )}
      />

      <Button loading={props.loading} onPress={handleSubmit(props.onSubmit)}>
        Login
      </Button>
    </View>
  )
}
