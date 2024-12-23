// import OpenAI from "openai"
import { useEffect, useState } from "react"
import useFetchState from "./hooks/useFetchState"

import './App.css'

// const DALLE_API_KEY = .......

// const openAi = new OpenAI({
//     apiKey: DALLE_API_KEY,
//     dangerouslyAllowBrowser: true,
// })
// console.log("OpenAI is ready", openAi)

// const request = async (req) => {
//     if (! openAi) {
//         console.log("OpenAI is not ready yet")
//         return
//     }
//     const completion = await openAi.chat.completions.create(req)
//     console.log(completion.choices[0].message);
// }

const host = "http://localhost:3456"
const routes = {
    dalle: "/dall-e",
    chatgpt: "/chatgpt",
}

// fetch(
//     `${host}/dall-e/onceOnly`,
//     {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         }
//     }
// )

function App() {
    
    const [url, setUrl] = useState("")
    const [req, setReq] = useState({request: ""})
    const [method, setMethod] = useState("POST")

    const {loading, loaded, error, data} = useFetchState(url, req, method)

    const [results, setResults] = useState({images:[], texts:[]})

    const listImages = () => {
        setMethod("GET")
        setUrl(`${host}${routes.dalle}`)
        setReq({
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
    }

    const generateImage = () => {
        setMethod("POST")
        setUrl(`${host}${routes.dalle}`)
        setReq({
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                request: [
                    // "Create an image of a cosy, diminutive living room with a low ceiling. There are no windows and the back walls are adorned with wooden planks. To the left, there's a comfortable sofa, and to the right, a display screen is mounted. The room is beautifully lit with colour LED lights. The centrepiece is a pool table in the middle, sitting on a plush carpet. On the foreground to the left, hosts a large computer desk. The room has tiled flooring, and the walls and ceiling are coloured white."",
                    "photo, taken from the door, small deep cosy Living room, small height, NO WINDOWS",
                    "back right contains a screen, back left a sofa, back walls are wooden, illuminated with color leds",
                    "middle is pooltable, carpet under the pooltable",
                    "foreground left large computer desktop",
                    "tiles on the floor, white ceiling, white walls",
                ].join(',')
            }),
        })
    }

    const generateText = () => {
        setMethod("POST")
        setUrl(`${host}${routes.chatgpt}`)
        setReq({
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                request: "Write me js code for importing dall-e in express application"
            }),
        })
    }

    const [img, setImg] = useState("")
    const openImage = (url) => {
        setImg(url)
    }
    const nextImage = () => {
        const index = results.images.indexOf(img)
        setImg(results.images[(index+1) % results.images.length])
    }
    const prevImage = () => {
        const index = results.images.indexOf(img)
        setImg(results.images[(results.images.length+index-1) % results.images.length])
    }
    const handleCloseImage = () => {
        setImg("")
    }

    useEffect(() => {
        listImages()
    }, [])

    useEffect(() => {
        if (loaded) {
            setResults(prev => {
                if (data.type === "image") {
                    return {
                        ...prev,
                        images: [
                            ...prev.images,
                            ...Object.values(data.images).map(obj=>obj.url)
                        ]
                    }
                }
                return {
                    ...prev,
                    texts: [
                        ...prev.texts,
                        ...Object.values(data.choices).map(obj=>obj.message.content)
                    ]
                }
            })
            console.log(data)
        }
    }, [data, loaded])


    return (
        <>
            <h1>DALL-E - BobyCe Home Architecture</h1>

            {/* CARDS */}
            <div className="container">
                <div className="UI">
                    <div className="buttons">
                        <button onClick={generateText} disabled={loading}>
                            Random Text
                        </button>
                        <button onClick={generateImage} disabled={loading}>
                            Random Image
                        </button>
                    </div>
                    <div className="zoom"></div>
                </div>
                {error && (
                    <div>
                        {JSON.stringify(error)}
                    </div>
                )}
                {results && results.texts && (
                    <div className="cards">
                        {results.texts.map((text, index) => (
                            <div key={index} className="card">
                                {text}
                            </div>
                        ))}
                    </div>
                )}
                {results && results.images && (
                    <div className="cards">
                        {results.images.map((image, index) => (
                            <div key={index} className="card" onClick={()=>{openImage(image)}}>
                                <img src={image} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/*  LOADING */}
            {loading && (
                <div className="loading-modal">
                    <div className="loading-window">loading...</div>
                </div>
            )}

            {/* LIGHTBOX */}
            {img&&(
                <div className="modal" onClick={handleCloseImage}>
                    <div className="modal-window" onClick={(ev)=>ev.stopPropagation()}>
                        <span className="close" onClick={handleCloseImage}>&times;</span>
                        <div className="modal-header">
                            <h2>Image</h2>
                        </div>
                        <div className="modal-body">
                            <p>Image generated by DALL-E</p>
                            <div className="lightbox">
                                <div className="lightbox-asset">
                                    <img src={img} />
                                </div>
                                <div className="arrow arrow-left" onClick={prevImage}></div>
                                <div className="arrow arrow-right" onClick={nextImage}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default App
