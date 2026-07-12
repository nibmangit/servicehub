import Input from "../ui/Input";
import Button from "../ui/Button";

export default function OtpCard({ title, buttonText, value, onChange, onSubmit }){

    return(

        <div className=" border rounded-2xl p-6 space-y-5 " >

            <h3 className=" text-xl font-semibold " >
                {title}
            </h3>

            <Input 
                placeholder="Enter OTP" 
                value={value} 
                onChange={onChange} 
            />

            <Button 
                onClick={onSubmit} 
                className="w-full" 
            > 
                {buttonText} 
            </Button>

        </div>

    )

}