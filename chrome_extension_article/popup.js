let articleLink;
const baseServerURL = "https://gold-lucky-sea-lion.cyclic.app"
document.addEventListener('DOMContentLoaded', function () {
    let loader = document.getElementById("loader");
    let placeholderHeadline = document.getElementById("placeholder-headline")
    let placeholderBias = document.getElementById("placeholder-bias")
    placeholderBias.style.display = 'none'
    placeholderHeadline.style.display = 'none'
    let headline = document.getElementById("headline")
    let bias = document.getElementById("bias")
    loader.style.display = 'none';
    const getDataBtn = document.getElementById("getData");
    console.log(getDataBtn)
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var tab = tabs[0];
        var url = tab.url;
        document.getElementById('url').textContent = `${url}`;
        articleLink = url;
    });
    getDataBtn.addEventListener("click",()=>{
        if(!articleLink.startsWith("https://timesofindia.indiatimes.com/")){
            alert("This Extension only Support Times Of India")
            return
        }
        loader.style.display = 'block';
        fetch(`${baseServerURL}/rhyme-headlines`,{
            method:"POST",
            body:JSON.stringify({
                articleLink
            }),
            headers:{
                "Content-type":"application/json"
            }
        }).then(res=>res.json()).then((data)=>{
            loader.style.display = 'none';
            console.log(data)
            headline.innerText = data.headline;
            bias.innerText = data.biasSummary;
            placeholderBias.style.display = 'block'
            placeholderHeadline.style.display = 'block'
        }).catch(err=>{
            loader.style.display = 'none';
            console.log(err);
        })
    })
    document.getElementById("validateEmail").addEventListener("click",()=>{
        validateEmail();
    })
    document.getElementById("verifyOTP").addEventListener("click",()=>{
        verifyOTP();
    })
  });

async function validateEmail() {
    const email = document.getElementById('email').value;
    let loader = document.getElementById("loader");
    loader.style.display = "block"
  
    try {
      const response = await fetch(`${baseServerURL}/validate-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message);
    loader.style.display = "none"
        // Show OTP input container
        document.getElementById('emailInputContainer').style.display = 'none';
        document.getElementById('otpInputContainer').style.display = 'block';
      } else {
        alert(data.error || 'Validation failed');
    loader.style.display = "none"
      }
    } catch (error) {
      console.error('Error during email validation:', error);
      alert('An error occurred during email validation');
    loader.style.display = "none"
    }
  }
  
async function verifyOTP() {
    let loader = document.getElementById("loader");
    const email = document.getElementById('email').value;
    const otp = document.getElementById('otp').value;
    loader.style.display = 'block'
    try {
      const response = await fetch(`${baseServerURL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message);
        loader.style.display = 'none'
        // Show article container
        document.getElementById('otpInputContainer').style.display = 'none';
        document.getElementById('articleContainer').style.display = 'block';
    } else {
        alert(data.error || 'OTP verification failed');
        loader.style.display = 'none'
    }
} catch (error) {
    console.error('Error during OTP verification:', error);
    alert('An error occurred during OTP verification');
    loader.style.display = 'none'
    }
}