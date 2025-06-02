import { FC, useEffect, useMemo, useState } from 'react'
import styles from './edit-contact-form.module.css'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { getContactByCpf, IContact } from '@/services'
import { Button, Input, SnackBar } from '@/components'
import { MapImageGirl } from '@/assets'
import { useAuth, useContacts, useGeolocation, useCEP, useForm } from '@/hooks'
import {
  capitalize,
  maskCpf,
  maskPhone,
  maskCep,
  validateNotEmpty,
  validateCpf,
  validatePhone,
  validateCepFormat,
  validateUF
} from '@/utils'

interface EditContactFormProps {
  contact: IContact
  onCancel: () => void
  onSubmit: () => void
}

type Coords = {
  lat: number
  lng: number
}

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

const EditContactForm: FC<EditContactFormProps> = ({ contact, onCancel, onSubmit }) => {
  const { user } = useAuth()
  const { editContact } = useContacts(user?.email || 'anon')

  const initialForm = useMemo(
    () => ({
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
    }),
    []
  )

  const requiredFormFields: (keyof typeof initialForm)[] = useMemo(
    () =>
      ['name', 'cpf', 'phone', 'cep', 'street', 'number', 'neighborhood', 'city', 'state'] as const,
    []
  )

  const {
    values: form,
    errors,
    updateField,
    validateAll,
    setErrors,
    isFormValid,
    setValues,
    handleBlur
  } = useForm(initialForm, validators, maskers, requiredFormFields)

  const [success, setSuccess] = useState('')
  const [coords, setCoords] = useState<Coords | null>(null)

  // busca de endereço pela API de ViaCEP  
  const rawCep = form.cep.replace(/\D/g, '')
  const shouldFetch = rawCep.length === 8
  const { address, isLoading, isError, errorMessage } = useCEP(shouldFetch ? rawCep : '')

  // Google Maps Loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  })

  // Formata o endereço completo para geolocalização
  const hasAddressData = form.street && form.number && form.city && form.state
  const fullAddress = useMemo(
    () => (hasAddressData ? `${form.street}, ${form.number}, ${form.city} - ${form.state}` : ''),
    [hasAddressData, form.street, form.number, form.city, form.state]
  )

  // Hook para obter as coordenadas geográficas do endereço
  const geolocationCoords = useGeolocation(fullAddress, isLoaded)

  // Preenche os campos do formulário com os dados do contato existente
  useEffect(() => {
    if (contact) {
      setValues({
        name: contact.name || '',
        cpf: maskCpf(contact.cpf || ''),
        phone: maskPhone(contact.phone || ''),
        cep: maskCep(contact.cep || ''),
        street: contact.street || '',
        number: contact.number || '',
        complement: contact.complement || '',
        neighborhood: contact.neighborhood || '',
        city: contact.city || '',
        state: contact.state || ''
      })
    }
  }, [contact, setValues])

  useEffect(() => {
    if (address) {
      setValues((prev) => ({
        ...prev,
        street: address.logradouro || '',
        neighborhood: address.bairro || '',
        city: address.localidade || '',
        state: address.uf || ''
      }))
    }
  }, [address, setValues])

  // Atualiza as coordenadas quando o endereço é carregado
  useEffect(() => {
    if (isLoaded && geolocationCoords) {
      setCoords(geolocationCoords)
    } else {
      setCoords(null)
    }
  }, [isLoaded, geolocationCoords])

  // Chamado quando o formulário é enviado. Ele valida os campos, verifica se o CPF já existe e adiciona o contato.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateAll()
    const hasError = Object.values(newErrors).some(Boolean)
    if (hasError) return
    if (!coords?.lat || !coords?.lng) return

    try {
      const cpfExists = contact.cpf !== form.cpf && getContactByCpf(user?.email || 'anon', form.cpf)
      if (cpfExists) {
        setErrors((prev) => ({
          ...prev,
          general: 'Este CPF já está cadastrado.'
        }))
        return
      }

      editContact(contact.id, { ...contact, ...form })
      setSuccess('Contato atualizado com sucesso!')
      onSubmit()
    } catch (error) {
      console.error('Erro ao verificar CPF:', error)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Editar Contato</h2>

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
          >
            <Marker position={coords} />
          </GoogleMap>
        </div>
      ) : (
        <div className={styles.illustrationContainer}>
          <h3 className={styles.title}>Preencha os dados e a prévia do seu mapa aparecerá aqui</h3>
          <img className={styles.illustration} src={MapImageGirl} alt='Ilustração de mapa' />
        </div>
      )}

      <div className={styles.buttonGroup}>
        <Button type='button' onClick={onCancel} variant='outlined'>
          Cancelar
        </Button>
        <Button type='submit' disabled={!isFormValid}>
          Salvar Contato
        </Button>
      </div>

      {errors.general && (
        <SnackBar
          message={errors.general ?? ''}
          open={!!errors.general}
          variant='danger'
          onClose={() => setErrors((prev) => ({ ...prev, general: '' }))}
        />
      )}

      {success && (
        <SnackBar
          open={!!success}
          message={success}
          variant='success'
          onClose={() => setSuccess('')}
        />
      )}
    </form>
  )
}

export default EditContactForm
