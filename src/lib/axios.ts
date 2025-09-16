import axios from "axios";

const API = process.env.REACT_APP_TMDB_API_KEY!;
const BASE = process.env.REACT_APP_TMDB_BASE_URL!;

// Se sua chave é o token de LEITURA (v4, estilo Bearer):
export const tmdb = axios.create({
  baseURL: BASE,
  headers: { Authorization: `Bearer ${API}` }
});

// Se for API key v3 (string curta), troque pelo formato abaixo:
// export const tmdb = axios.create({ baseURL: BASE, params: { api_key: API } });
