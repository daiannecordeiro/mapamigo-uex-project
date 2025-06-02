import { useState, useEffect, FC } from 'react'
import styles from './new-contact-form.module.css'
import { Button, Input, SnackBar } from '@/components'
import { getContactByCpf } from '@/services'
import { useCEP, useContacts, useGeolocation, useAuth } from '@/hooks'
import { MapImageGirl } from '@/assets'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { useForm } from '@/hooks'
import {
  maskCep,
  maskCpf,
  maskPhone,
  validateCepFormat,
  validateCpf,
  validateNotEmpty,
  validatePhone,
  validateUF,
  capitalize
} from '@/utils'

type Coords = {
  lat: number
  lng: number
}

const initialForm = {
  name: '',
  cpf: '',
  phone: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: ''
}

const requiredFormFields: (keyof typeof initialForm)[] = [
  'name',
  'cpf',
  'phone',
  'cep',
  'street',
  'number',
  'neighborhood',
  'city',
  'state'
]

const validators = {
  name: validateNotEmpty,
  cpf: validateCpf,
  phone: validatePhone,
  cep: validateCepFormat,
  street: validateNotEmpty,
  number: validateNotEmpty,
  complement: () => '',
  neighborhood: validateNotEmpty,
  city: validateNotEmpty,
  state: validateUF
}

const maskers = {
  cpf: maskCpf,
  phone: maskPhone,
  cep: maskCep,
  name: capitalize,
  state: (v: string) => v.toUpperCase()
}

const NewContactForm: FC = () => {
  const [success, setSuccess] = useState('')
  const [coords, setCoords] = useState<Coords | null>(null)

  const { user } = useAuth()
  const { addContact } = useContacts(user?.email || 'anon')

  const {
    values: form,
    errors,
    updateField,
    validateAll,
    resetForm,
    setErrors,
    isFormValid,
    handleBlur
  } = useForm(initialForm, validators, maskers, requiredFormFields)

  // ViaCEP
  const rawCep = form.cep.replace(/\D/g, '')
  const shouldFetch = rawCep.length === 8
  const { address, isLoading, isError, errorMessage } = useCEP(shouldFetch ? rawCep : '')

  useEffect(() => {
    if (address) {
      updateField('street', address.logradouro || '')
      updateField('neighborhood', address.bairro || '')
      updateField('city', address.localidade || '')
      updateField('state', address.uf || '')
    }
  }, [address, updateField])

  // Google Maps Loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  })

  const hasAddressData =
    form.street.trim() && form.number.trim() && form.city.trim() && form.state.trim()

  const fullAddress = hasAddressData
    ? `${form.street}, ${form.number}, ${form.city} - ${form.state}`
    : ''

  const geolocationCoords = useGeolocation(fullAddress, isLoaded)

  useEffect(() => {
    if (!isLoaded || !address) {
      setCoords(null)
      return
    }
    setCoords(geolocationCoords)
  }, [address, fullAddress, isLoaded, geolocationCoords])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = validateAll()
    const hasError = Object.values(newErrors).some(Boolean)
    if (hasError) return

    if (!coords?.lat || !coords?.lng) return

    const cpfExists = getContactByCpf(user?.email || 'anon', form.cpf)
    if (cpfExists) {
      setErrors((prev) => ({ ...prev, general: 'Este CPF já está cadastrado.' }))
      return
    }

    try {
      await addContact({
        id: crypto.randomUUID(),
        ...form,
        latitude: coords.lat,
        longitude: coords.lng
      })

      resetForm()
      setSuccess('Contato salvo com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar contato:', error)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Novo Contato</h2>

      <div className={styles.inputGroup}>
        <Input
          label='Nome'
          value={form.name}
          onChange={(v) => updateField('name', v)}
          error={errors.name}
          onBlur={() => handleBlur('name')}
        />
        <Input
          label='CPF'
          value={form.cpf}
          onChange={(v) => updateField('cpf', v)}
          error={errors.cpf}
          maxlength={14}
          onBlur={() => handleBlur('cpf')}
        />
      </div>

      <div className={styles.inputGroup}>
        <Input
          label='Telefone'
          value={form.phone}
          onChange={(v) => updateField('phone', v)}
          error={errors.phone}
          maxlength={15}
          onBlur={() => handleBlur('phone')}
        />
        <Input
          label='CEP'
          value={form.cep}
          onChange={(v) => updateField('cep', v)}
          error={isError ? errorMessage : errors.cep}
          loading={isLoading}
          maxlength={10}
          onBlur={() => handleBlur('cep')}
        />
      </div>

      <div className={styles.inputGroup}>
        <Input
          label='Logradouro'
          value={form.street}
          onChange={(v) => updateField('street', v)}
          disabled={isLoading}
          error={errors.street}
          onBlur={() => handleBlur('street')}
        />
        <Input
          label='Número'
          value={form.number}
          onChange={(v) => updateField('number', v)}
          error={errors.number}
          onBlur={() => handleBlur('number')}
        />
      </div>

      <div className={styles.inputGroup}>
        <Input
          label='Complemento'
          value={form.complement}
          onChange={(v) => updateField('complement', v)}
        />
        <Input
          label='Bairro'
          value={form.neighborhood}
          onChange={(v) => updateField('neighborhood', v)}
          disabled={isLoading}
          error={errors.neighborhood}
          onBlur={() => handleBlur('neighborhood')}
        />
      </div>

      <div className={styles.inputGroup}>
        <Input
          label='Cidade'
          value={form.city}
          onChange={(v) => updateField('city', v)}
          disabled={isLoading}
          error={errors.city}
          onBlur={() => handleBlur('city')}
        />
        <Input
          label='Estado (UF)'
          value={form.state}
          onChange={(v) => updateField('state', v)}
          disabled={isLoading}
          error={errors.state}
          maxlength={2}
          onBlur={() => handleBlur('state')}
        />
      </div>

      {isLoaded && coords?.lat && coords?.lng ? (
        <div className={styles.mapContainer}>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '300px' }}
            center={coords}
            zoom={16}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: true,
              fullscreenControl: true
            }}
            onLoad={(map) => {
              map.setOptions({
                styles: [
                  {
                    featureType: 'poi',
                    stylers: [{ visibility: 'off' }]
                  }
                ]
              })
            }}
          >
            <Marker position={coords} />
          </GoogleMap>
        </div>
      ) : (
        <div className={styles.illustrationContainer}>
          <img src={MapImageGirl} alt='Mapa' />
        </div>
      )}

      <SnackBar
        message={errors.general}
        open={!!errors.general}
        variant='danger'
        onClose={() => setErrors((prev) => ({ ...prev, general: '' }))}
      />

      <SnackBar
        open={!!success}
        message={success}
        variant='success'
        onClose={() => setSuccess('')}
      />

      <Button type='submit' disabled={!isFormValid}>
        Salvar
      </Button>
    </form>
  )
}

export default NewContactForm
