document.addEventListener('DOMContentLoaded',async ()=>{
    const signupForm = document.getElementById('signupForm');
    try {
        const response = await axios.get('http://localhost:3000/user/fetch');
        console.log(response.data);
    } catch (error) {
        console.log('Something went wrong',error);
    }
    signupForm.addEventListener('submit', async(event)=>{
        event.preventDefault();
        const formData = new FormData(signupForm);
        const formValues = Object.fromEntries(formData.entries());
        try {
            const response = await axios.post('http://localhost:3000/user/add',formValues);
            console.log(`User with name ${response.data.user.name} is added`);
            signupForm.reset();
        } catch (error) {
            console.log('Something went wrong',error);
        }
    });
});
