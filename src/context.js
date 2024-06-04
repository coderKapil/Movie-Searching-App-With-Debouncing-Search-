// parent ka data children kabhi bhi get kar sakta hai aur koi bhi child get kar sakta hai for this purpose we will be using context Api
// Context(warehouse)
// Provider jo data ko leke aayega child tak (delivery boy)
// and we need a consumer to consume that data consumer syntax was too lengthy to overcome this useContext hook was introduced which do the same task

import { createContext, useContext,useEffect, useState } from "react";

export const API_URL = `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}`

const AppContext = createContext()
// we need to create a provider so we will provide this appprovider to index.js so that it becomes global
// app jisko wrap kiya hai usme hum data ko het ka sake isliye humko children dena padega
 const AppProvider = ({children})=>{
  // whenever we are sharing data from parent to child we use context api but it should be in state thats why we are using usestate hook
      const [isLoading,setIsLoading] = useState(true)
      const [movie,setMovie] = useState([])
      const [isError,setIsError] = useState({show: "false", msg: ""})
      const [query,setQuery] = useState("titanic")

      const getMovies = async(url)=>{
        setIsLoading(true)
         try {
          const res = await fetch(url)
          const data = await res.json()
          if(data.Response === "True"){
            setIsLoading(false)
            setMovie(data.Search)
            setIsError({
              show: false,
              msg: ""
            })
            console.log(data.Search);
          }
          else{
            setIsError({
              show: true,
              msg: data.Error
            })
          }
          // console.log(data);
         } catch (error) {
          console.log(error);
         }
      }
     useEffect(()=>{
      // applying debouncing here first we will delay the function inside useffect and then cleanup that timeout with clearTimeout function and now at the end we will get the output this will reduces the load on our server 
      let timerID = setTimeout(() => {
        getMovies(`${API_URL}&s=${query}`)
        
      }, 500);

      // Cleanup function
      return ()=> clearTimeout(timerID)
     },[query])
    return <AppContext.Provider value={{isLoading,movie,isError,query,setQuery}}>
      {children}
    </AppContext.Provider>
}
// this is a custom hook we created here to directly use it in child component
const useGlobalContext = ()=>{
  return useContext(AppContext)
}

export {AppContext,AppProvider,useGlobalContext}
