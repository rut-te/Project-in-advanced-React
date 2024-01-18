import '../css/Messege.css'

export default function SuccessfulOperation({messege}) {
    return (        
        <div className="messege">
            <h3>The {messege} was successful</h3>
        </div>
    )
}