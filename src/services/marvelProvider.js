import { md5 } from '../libs/md5.js'

const PUBLIC_KEY = "f5c6a6461fdefb8a6299942dc378c182"
const PRIVATE_KEY = "4488d6d52c2bcb9e6b1aca391d92b7e246b31f03"
const BASE_URL = "https://gateway.marvel.com:443/v1/public/"

let ts = Date.now()
let hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY)

export async function getMarvels(charOrSerie = 'characters', name = '', id = '') {
  let nameOrTitle = charOrSerie == 'characters' ? 'name' : 'title'
  let url = BASE_URL + `${charOrSerie}${id ? '/' + id : ''}?${nameOrTitle}StartsWith=${name}&orderBy=${nameOrTitle}&apikey=${PUBLIC_KEY}&ts=${ts}&hash=${hash}`
  
  let results = await fetch(url).catch(console.error)
  results = await results.json()

  return results.data.results
}
