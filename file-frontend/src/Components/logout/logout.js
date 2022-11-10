import { useEffect, useState } from "react";
import "./logout.css"
import jwt_decode from "jwt-decode";
import axios from 'axios'

const Logout = () => {
  const [user, setUser] = useState({});
  const [file, setFile] = useState();
  const [files, setFiles] = useState([]);
  const [token, setToken] = useState("");
  const [uploaded, setUploaded] = useState(null)
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    document.getElementById("file-upload-btn").disabled = false;
    setWarning(false);
    const token = localStorage.getItem("token");
    setToken(token);
    const userObject = jwt_decode(token);
    setUser(userObject);
    fetch("http://localhost:8080/list", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
        "Authorization": `${token}`
      },
    })
      .then(resp => resp.json())
      .then(data => setFiles(data))
  }, []);


  const reload = () => {
    window.location = "/";
  }
  const handelLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedin");
    reload();
  };
  const downloadFile = (e) => {
    fetch(`http://localhost:8080/download/${e.target.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
        "Authorization": `${token}`
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(
          new Blob([blob]),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `${e.target.id}`,
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
      });
  }

  const submit = async event => {
    event.preventDefault()
    document.getElementById("file-upload-btn").disabled = true;
    const formData = new FormData();
    formData.append("file", file)
    await axios.post("http://localhost:8080/upload", formData, {
      onUploadProgress: (data) => {
        const totalMb = data.total / 1e+6
        if (totalMb > 100) {
          setWarning(true);
        }
        setUploaded(Math.round((data.loaded / data.total) * 100))
      },
      headers: { 'Content-Type': 'multipart/form-data', "Authorization": `${token}` }
    }).then(
      resp => resp
    ).then(
      () => window.location.reload()
    )
  }



  return (
    <>
      <div className="container-box">
        <div className="userbox">
          <h2>Hi, {user.name} <br /> Welcome to file System <br /> Upload Files Now!</h2>


          <img alt="userimage" src={user.picture} className="userimg" />
        </div>

        <button className="logoutbtn" onClick={() => handelLogout()}>Log Out</button>
        <form onSubmit={submit} >
          <input onChange={e => setFile(e.target.files[0])} name="file" id="file" type="file" placeholder="No file chosen" required />
          <button id="file-upload-btn" type="submit" className="uploadbtn">Upload</button>
        </form>
        {
          warning && <div>
            <span className="warn-ing">You are uploading a large file it might take time to upload <br /> don't refresh the page or close the browser</span>
          </div>
        }
        {uploaded &&
          <div className="progress mt-2" id="progressbar">

            <div className="progress-bar"
              role="progressbar"
              aria-valuenow={uploaded}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: `${uploaded}%` }}
            >
              {uploaded}%
            </div>
          </div>
        }
        <div className="row row-cols-1 row-cols-md-4 g-4" id="margin-htao">
          {
            files.map((each, i) => {
              return (
                <div key={i} className="col" >
                  <div className="card h-100" id="card-of-file">
                    <img className="card-img-top" src="./img_664.png" alt="fileicon" height="250" width="150" />
                    <div className="card-body">
                      <h3 className="card-title" key={i}>{i + 1} {(each).split("+")[1]}</h3>
                      <button onClick={(e) => downloadFile(e)} id={each} className="dwnbtn">Download</button>
                    </div>

                  </div>
                </div>

              )
            })
          }
        </div>
      </div>
    </>
  )
}

export default Logout;