
import AdminButton from "./AdminButton";
import ThemeSwitcher from "./window/ThemeSwitcher";
import WindowFrame from "./window/WindowFrame";

export default function Home() {
   return (
    <main className="min-h-screen bg-teal-700 p-10">
         <WindowFrame title="Projects">
          <p>Hier komt straks je content.</p>
          <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque mauris orci, cursus ut dapibus vitae, egestas mollis diam. Morbi vel blandit erat. Aenean mollis aliquet ultricies. Nam eu viverra magna. Maecenas eu tellus ultrices, ullamcorper nunc non, aliquet est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec ut posuere lorem, id mollis mi. Mauris faucibus molestie erat, sit amet viverra tellus pellentesque id. Etiam semper dapibus eleifend.

Integer urna ipsum, sodales sagittis rhoncus vel, commodo vel eros. Nullam iaculis porta ex ut porttitor. Fusce auctor euismod purus a dapibus. Curabitur quam elit, elementum tincidunt gravida sit amet, volutpat sed turpis. In efficitur et lorem at sollicitudin. Donec viverra velit in facilisis suscipit. Nulla velit leo, cursus in bibendum id, egestas quis lorem. Proin nec mi libero. Pellentesque metus ante, euismod eu lobortis ut, faucibus eu tellus. Pellentesque ac erat metus. Integer efficitur aliquam turpis quis congue.

Phasellus commodo a neque in pulvinar. Donec iaculis leo neque, in placerat mi mattis sed. Mauris dignissim erat eu ipsum bibendum finibus. Vestibulum commodo purus vel felis bibendum, vitae luctus nisl iaculis. In at porta mi, ut ornare purus. Morbi neque eros, efficitur eu odio id, luctus faucibus velit. Nullam fermentum hendrerit quam at dictum. Vivamus volutpat purus vitae porta maximus. Donec malesuada nec orci a mollis.

Etiam sit amet varius justo. Phasellus at justo dictum, consectetur nulla in, egestas augue. Integer non sem sodales, feugiat lacus vitae, finibus sem. Pellentesque condimentum feugiat molestie. Vivamus condimentum turpis vitae vehicula feugiat. Nunc tristique consectetur odio, quis pretium neque ullamcorper vitae. Integer quam tellus, consectetur non pretium in, sagittis quis nisl. Morbi non dolor sodales, sollicitudin lorem sed, condimentum justo. Ut a facilisis mi. Donec pharetra nulla in augue commodo, at vestibulum metus ultricies. Pellentesque laoreet hendrerit tempor. Curabitur non hendrerit leo, eu venenatis dolor. Donec quis posuere sapien, ut viverra ante.

Ut sit amet lobortis libero, ac rhoncus odio. Maecenas commodo mollis nunc quis mollis. Integer interdum molestie ornare. Nulla efficitur, mi nec vulputate tempus, sapien lorem accumsan nunc, id rhoncus neque tellus cursus lacus. Fusce interdum libero eu turpis rhoncus aliquet. Vivamus odio lorem, iaculis et tellus a, finibus rhoncus lorem. Integer mattis pretium purus, et accumsan dolor sodales sit amet. Vivamus et dignissim odio. Quisque quis ante mauris. Sed sit amet est fermentum, elementum augue eu, dignissim nisl. Suspendisse vitae pulvinar mi. Cras facilisis dignissim metus. In eget faucibus augue. Cras luctus eu metus eget euismod. Vestibulum vulputate a dui a rhoncus. Nulla scelerisque metus ornare, vestibulum felis ac, blandit neque. </p>
  </WindowFrame>
      
      <div className="p-1"></div>
       <WindowFrame title="Switch the theme!">
         <ThemeSwitcher></ThemeSwitcher>
       </WindowFrame>
       <AdminButton></AdminButton>
    </main>
  );
}