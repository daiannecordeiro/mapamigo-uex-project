import { FC, useState } from 'react'
import styles from './contact-detail.module.css'
import { IContactDetail } from './contact-detail.interface'
import { Button, Dialog } from '@/components'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { useAuth, useContacts } from '@/hooks'


const ContactDetail: FC<IContactDetail> = ({ contact, onEdit, onDeleteSuccess }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { user } = useAuth()
  const { removeContact } = useContacts(user?.email || 'anon')

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  })

  // Função para lidar com a exclusão do contato
  const handleDelete = async () => {
    await removeContact(contact.id)
    setDialogOpen(false)
    if (onDeleteSuccess) onDeleteSuccess()
  }

  return (
    <div className={styles.detailWrapper}>
      {loadError && <p>Erro ao carregar o mapa</p>}
      {!isLoaded && <p>Carregando mapa...</p>}
      {isLoaded && (
        <GoogleMap
          mapContainerClassName={styles.mapContainer}
          center={{ lat: contact.latitude, lng: contact.longitude }}
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
          <Marker position={{ lat: contact.latitude, lng: contact.longitude }} />
        </GoogleMap>
      )}

      <div className={styles.infoBar}>
        <div className={styles.info}>
          <h2>{contact.name}</h2>
          <p>CPF: {contact.cpf}</p>
          <p>Telefone: {contact.phone}</p>
          <p>
            Endereço: {contact.street}, {contact.number}
            {contact.complement && `, ${contact.complement}`}, {contact.neighborhood},{' '}
            {contact.city} - {contact.state} - {contact.cep}
          </p>
        </div>

        <div className={styles.actions}>
          <Button onClick={onEdit}>Editar</Button>
          <Button variant='outlined' onClick={() => setDialogOpen(true)}>
            Excluir
          </Button>
        </div>
      </div>

      <Dialog
        open={dialogOpen}
        title='Excluir Contato'
        message={`Você tem certeza que deseja excluir o contato ${contact.name}?`}
        onConfirm={handleDelete}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  )
}

export default ContactDetail
