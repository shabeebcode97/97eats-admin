export interface AppStateInterface {
  user: UserInterface | null,
  baseURL: string | undefined,
  languages: LanguagesInterface[] | null
}

export interface LabelIdInterface {
  id: number,
  label: string
}

export interface LanguagesInterface extends LabelIdInterface {
  code: string
}
export interface UserInterface {
  name: string | null,
  email: string | null,
  id: number | null
}

function state(): AppStateInterface {
  return {
    user: null,
    baseURL: process.env.DEV ? process.env.BASEURL : 'https://app.nscode.dev',
    languages: null
  };
}

export default state;
