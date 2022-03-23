import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios'
import Draggable from "react-draggable";
import domtoimage from 'dom-to-image'


export default function MemePic() {
    const imageRef = useRef(null);

    const [getPic, setGetPic] = useState();
    const [randomImg, setRandomImg] = useState();
    const [inputText, setInputText] = useState({
      topText: "",
      bottomText: ""
    })
    const [toggle, setToggle] = useState(false);
    const [toggleField, setToggleField] = useState(false);
    const [userImage, setUserImage] = useState({file:null})
    
    
    useEffect(() => {
        const fetchGetPic = async () => {
          try {
            await axios
              .get("https://api.imgflip.com/get_memes")
              .then((result) => setGetPic(result.data.data.memes));
            
          } catch (e) {
            console.log(e.message);
          }
        };
        fetchGetPic();
      }, []);

      

      const handleChange = e => {
        setInputText({
          ...inputText,
          [e.target.name]: e.target.value,
        })
      }
    
      const handleSubmit = e => {
        e.preventDefault()
        const randomNumber = Math.floor(Math.random() * getPic.length)
        const randomImgUrl = getPic[randomNumber].url
        setRandomImg(randomImgUrl)
        
      }

      const handleReset = () => {
        setInputText({
          topText: "",
          bottomText: ""
        })
        setRandomImg();
      }
      
      const handleToggle = () => {
        setToggle(!toggle)
        console.log(toggle);
      }

      const handleToggleField = () => {
        setToggleField(!toggleField);
      }

      const handleFileInput = (e) => {
        setUserImage({ file: URL.createObjectURL(e.target.files[0]) })
      }

      const handleDownload = () => {
          const downloadImage = imageRef.current
          domtoimage.toJpeg(downloadImage, { quality: 0.95 }).then((imageUrl) => {
            const link = document.createElement('a')
            link.download = 'meme.jpeg'
            link.href = imageUrl
            link.click()
          })
      }

    
    return(
        <div className='wrapper'>
          <h2>Build Your Own Meme.</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="topText"
              placeholder="Add Top Text"
              value={inputText.topText}
              onChange={handleChange}
              />
            <input
            type="text"
            name="bottomText"
            placeholder="Add Bottom Text"
            value={inputText.bottomText}
            onChange={handleChange}
            />
            <button>New Meme</button>
          </form>
          <button onClick={handleToggle}>{toggle ? 'Color White' : 'Color Black'}</button>
          <button onClick={handleToggleField}>{toggleField ? 'Close Field' : 'Extra Field'} </button>
          <button onClick={handleDownload}>Download</button>
          
          
        <div className='meme' ref={imageRef}>
            <img src={userImage.file ? userImage.file : randomImg} alt="" />
            {toggleField && <div className='field'></div>}
            <div className='text'>
            <Draggable>
            <div className='top'><p  style ={toggle ? {color: 'black'} : {color: 'white'}}>{inputText.topText}</p></div>
            </Draggable>
            <Draggable>
            <div className='bottom'><p  style ={toggle ? {color: 'black'} : {color: 'white'}}>{inputText.bottomText}</p></div>
            </Draggable>
            </div>
            
        </div>
        <form>
          <input
            type="file"
            name="fileinput"
            id="fileinput"
            onChange={handleFileInput}
          />
          <button className='btnReset' onClick={handleReset}>Reset</button>
        </form>
        
        
        </div>
        
        
      
    )
}