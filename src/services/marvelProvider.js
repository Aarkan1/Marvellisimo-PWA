import { md5 } from '../libs/md5.js'

const PUBLIC_KEY = "f5c6a6461fdefb8a6299942dc378c182"
const PRIVATE_KEY = "4488d6d52c2bcb9e6b1aca391d92b7e246b31f03"
const BASE_URL = "https://gateway.marvel.com:443/v1/public/"

let ts = Date.now()
let hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY)

export async function getMarvels(charOrSerie = 'characters', name = '', id = '') {

  let fromIDB = await IDB.read('marvels', charOrSerie + (name || id))
  if(fromIDB) return fromIDB.data

  let nameOrTitle = charOrSerie == 'characters' ? '?name' : '?title'
  nameOrTitle += 'StartsWith=' + name + '&'
  if(!name) nameOrTitle = '?'

  let url = BASE_URL + `${charOrSerie}${
    id ? '/' + id : ''
    }${nameOrTitle}orderBy=${
      charOrSerie == 'characters' ? 'name' : 'title'
    }&apikey=${PUBLIC_KEY}&ts=${ts}&hash=${hash}`
  
  let results = await fetch(url).catch()
  results = await results.json()

  let idbData = {
    id: charOrSerie + (name || id),
    data: results.data.results
  }

  await IDB.write('marvels', idbData)

  return results.data.results
}
