import React from 'react';
import { useTheme } from './../../hooks/theme';

export const DarkmodeToggle = React.memo(
  (props: ReturnType<typeof useTheme>
) => {
  return (
    <button onClick={props.toggleTheme} className='icon group'>
      <svg className="svg-icon" viewBox="0 0 60 60" fill='currentColor'>
        <path strokeWidth="1" d="M58 29C58 13.345 45.529.555 30 .025V0h-1C13.009 0 0 13.01 0 29s13.009 29 29 29h1v-.025c15.529-.53 28-13.32 28-28.975zM2.035 27.627c.007-.147.023-.291.033-.437.02-.307.039-.613.07-.917.018-.178.045-.353.066-.53.033-.269.062-.539.103-.805.028-.187.065-.371.097-.557.044-.253.085-.507.136-.758.038-.189.085-.375.127-.562.055-.244.107-.489.169-.731.048-.188.103-.372.155-.558.066-.237.13-.475.202-.71.057-.186.122-.369.183-.553.077-.23.151-.462.234-.689.067-.183.14-.364.21-.545.087-.224.172-.449.265-.671.075-.179.156-.354.235-.531.097-.219.193-.439.297-.655.084-.175.173-.347.26-.52.107-.212.213-.425.325-.635.092-.17.188-.337.283-.505.117-.207.234-.415.356-.618.099-.165.203-.326.305-.489.126-.201.253-.401.384-.599.108-.161.22-.32.331-.479.134-.192.268-.384.407-.573.116-.157.236-.311.355-.466.142-.184.285-.369.432-.55.123-.151.249-.298.375-.447.152-.178.304-.356.46-.531.129-.144.262-.286.394-.427.16-.171.32-.341.484-.507.136-.139.276-.274.415-.41.167-.163.335-.325.506-.483.143-.132.288-.262.434-.391.174-.154.349-.307.527-.457.151-.127.304-.251.457-.374.179-.144.36-.287.543-.427.158-.12.317-.238.478-.355.186-.136.373-.269.562-.4.164-.113.329-.224.495-.333.192-.126.385-.251.581-.373.17-.106.341-.209.513-.311.197-.117.396-.232.597-.344.176-.098.353-.195.531-.289.202-.107.406-.211.611-.314.182-.091.365-.18.55-.266.206-.097.414-.19.623-.282.188-.083.377-.164.567-.242.21-.087.423-.17.636-.251.194-.074.389-.147.585-.217.214-.076.429-.148.645-.219.2-.065.4-.13.602-.191.217-.065.435-.126.654-.186.205-.056.411-.112.618-.163.22-.055.441-.104.663-.153.211-.047.421-.093.633-.135.222-.044.446-.082.669-.12.216-.037.432-.073.65-.105.223-.032.448-.059.673-.086.222-.026.443-.053.666-.074.226-.021.453-.036.68-.052.225-.015.45-.032.677-.042.063-.003.127-.003.19-.005v53.949c-.063-.002-.127-.002-.19-.005-.227-.01-.452-.026-.677-.042-.227-.016-.454-.031-.68-.052-.223-.021-.445-.048-.666-.074-.225-.027-.45-.053-.673-.086-.218-.032-.434-.068-.65-.105-.224-.038-.448-.076-.669-.12-.212-.042-.423-.088-.633-.135-.222-.049-.444-.099-.663-.153-.207-.051-.413-.107-.618-.163-.219-.06-.438-.121-.654-.186-.202-.061-.402-.125-.602-.191-.216-.071-.432-.143-.645-.219-.196-.07-.391-.143-.585-.217-.213-.081-.425-.165-.636-.251-.19-.078-.379-.159-.567-.242-.209-.092-.417-.185-.623-.282-.184-.087-.368-.176-.55-.266-.205-.102-.409-.206-.611-.314-.178-.094-.355-.191-.531-.289-.201-.112-.399-.227-.597-.344-.172-.102-.343-.206-.513-.311-.195-.122-.389-.246-.581-.373-.166-.109-.331-.22-.495-.333-.189-.131-.377-.265-.562-.4-.16-.117-.32-.235-.478-.355-.183-.14-.364-.283-.543-.427-.154-.124-.306-.248-.457-.374-.178-.15-.353-.303-.527-.457-.146-.129-.291-.258-.434-.391-.171-.158-.339-.32-.506-.483-.139-.136-.279-.271-.415-.41-.164-.167-.324-.337-.484-.507-.132-.141-.265-.283-.394-.427-.156-.174-.308-.352-.46-.531-.126-.148-.252-.296-.375-.447-.147-.181-.29-.365-.432-.55-.119-.148-.239-.303-.355-.459-.139-.188-.273-.381-.407-.573-.111-.159-.223-.317-.331-.479-.131-.197-.258-.398-.384-.599-.102-.163-.206-.324-.305-.489-.122-.204-.239-.411-.356-.618-.095-.168-.192-.335-.283-.505-.112-.209-.218-.422-.325-.635-.087-.173-.176-.345-.26-.52-.103-.216-.199-.436-.297-.655-.079-.177-.16-.353-.235-.531-.093-.221-.178-.446-.265-.671-.07-.182-.144-.362-.21-.545-.083-.228-.157-.459-.234-.689-.061-.184-.126-.367-.183-.553-.072-.235-.136-.473-.202-.71-.052-.186-.107-.371-.155-.558-.062-.242-.114-.487-.169-.731-.042-.187-.089-.373-.127-.562-.051-.251-.092-.505-.136-.758-.032-.186-.069-.37-.097-.557-.04-.266-.07-.536-.103-.805-.021-.177-.048-.352-.066-.53-.031-.304-.049-.61-.07-.917-.01-.146-.025-.291-.033-.437C2.012 29.918 2 29.46 2 29s.012-.918.035-1.373zm36.949 26.451c.002-.027.016-.05.016-.078 0-.552-.448-1-1-1s-1 .448-1 1c0 .271.11.514.284.694-2.309.746-4.752 1.187-7.284 1.28V55c.552 0 1-.448 1-1s-.448-1-1-1v-6c.552 0 1-.448 1-1s-.448-1-1-1v-6c.552 0 1-.448 1-1s-.448-1-1-1v-6c.552 0 1-.448 1-1s-.448-1-1-1v-6c.552 0 1-.448 1-1s-.448-1-1-1v-6c.552 0 1-.448 1-1s-.448-1-1-1V7c.552 0 1-.448 1-1s-.448-1-1-1V2.025c1.036.038 2.059.129 3.062.281.131.4.494.694.938.694.312 0 .579-.151.762-.375C46.89 5.273 56 16.09 56 29c0 2.89-.461 5.672-1.306 8.284-.18-.174-.423-.284-.694-.284-.552 0-1 .448-1 1s.448 1 1 1c.028 0 .051-.014.078-.016-2.744 6.868-8.226 12.35-15.094 15.094z"/>
        <circle cx="34" cy="10" r="1"/>
        <circle cx="42" cy="10" r="1"/>
        <circle cx="38" cy="14" r="1"/>
        <circle cx="38" cy="6" r="1"/>
        <circle cx="34" cy="18" r="1"/>
        <circle cx="42" cy="18" r="1"/>
        <circle cx="38" cy="22" r="1"/>
        <circle cx="34" cy="26" r="1"/>
        <circle cx="42" cy="26" r="1"/>
        <circle cx="38" cy="30" r="1"/>
        <circle cx="34" cy="34" r="1"/>
        <circle cx="42" cy="34" r="1"/>
        <circle cx="38" cy="38" r="1"/>
        <circle cx="34" cy="42" r="1"/>
        <circle cx="42" cy="42" r="1"/>
        <circle cx="38" cy="46" r="1"/>
        <circle cx="34" cy="50" r="1"/>
        <circle cx="42" cy="50" r="1"/>
        <circle cx="46" cy="14" r="1"/>
        <circle cx="50" cy="18" r="1"/>
        <circle cx="46" cy="22" r="1"/>
        <circle cx="54" cy="22" r="1"/>
        <circle cx="50" cy="26" r="1"/>
        <circle cx="46" cy="30" r="1"/>
        <circle cx="54" cy="30" r="1"/>
        <circle cx="50" cy="34" r="1"/>
        <circle cx="46" cy="38" r="1"/>
        <circle cx="50" cy="42" r="1"/>
        <circle cx="46" cy="46" r="1"/>
      </svg>
      <span className="tooltip color origin-center right-14 group-hover:scale-100">Toggle theme</span>
    </button>
  );
});
