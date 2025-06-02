import { useEffect, useState } from 'react'

interface Coordinates {
  lat: number
  lng: number
}

// Esse hook é usado para obter as coordenadas geográficas (latitude e longitude) de um endereço usando a API do Google Maps.

export const useGeolocation = (address: string, isLoaded: boolean): Coordinates | null => {
  const [coords, setCoords] = useState<Coordinates | null>(null)

  useEffect(() => {
    if (!isLoaded || !address || !window.google || !google.maps?.Geocoder) return

    const geocoder = new google.maps.Geocoder()

    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location
        setCoords({ lat: location.lat(), lng: location.lng() })
      } else {
        setCoords(null)
      }
    })
  }, [address, isLoaded])

  return coords
}
