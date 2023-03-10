import useSupabase from 'src/boot/supabase'
import useAuthUser from './UseAuthUser'
import { v4 as uuidv4 } from 'uuid'

export default function useApi () {
  const { supabase } = useSupabase()
  const { user } = useAuthUser()

  const list = async (table) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
    if (error) throw error
    return data
  }

  const listPublic = async (table, userId, columnFilter = '', filter = '') => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId)
      .eq(columnFilter, filter)
    if (error) throw error
    return data
  }

  const fetchCount = async (table, userId) => {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
    if (error) throw error
    return {
      data,
      count
    }
  }

  const getById = async (table, id) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
    if (error) throw error
    return data[0]
  }

  const post = async (table, form) => {
    const { data, error } = await supabase
      .from(table)
      .insert([
        {
          ...form,
          user_id: user.value.id
        }
      ])
    if (error) throw error
    return data
  }

  const update = async (table, form) => {
    const { data, error } = await supabase
      .from(table)
      .update({ ...form })
      .match({ id: form.id })
    if (error) throw error
    return data
  }

  const remove = async (table, id) => {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .match({ id })
    if (error) throw error
    return data
  }
  const uploadImg = async (file, storage) => {
    const fileName = uuidv4()
    const { error } = supabase
      .storage
      .from(storage)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
    const publicURL =
    await getUrlPublic(fileName, storage)
    if (error) throw error
    return publicURL.publicUrl
  }

  const getUrlPublic = async (fileName, storage) => {
    const { data, error } = supabase
      .storage
      .from(storage)
      .getPublicUrl(fileName)
    if (error) throw error
    return data
  }

  return {
    list,
    listPublic,
    fetchCount,
    getById,
    post,
    update,
    remove,
    uploadImg

  }
}
