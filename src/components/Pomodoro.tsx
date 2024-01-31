// 'use client';

// import React, { useState, useEffect, FC, useMemo } from 'react';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuPortal,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { MoreHorizontal, Play, Pause } from 'lucide-react';

// interface Duration {
//   id: number;
//   label: string;
// }

// const PomodoroTimer: FC = () => {
//   const [minutes, setMinutes] = useState(25);
//   const [seconds, setSeconds] = useState(0);
//   const [isWorking, setIsWorking] = useState(true);
//   const [isPaused, setIsPaused] = useState(false);
//   const [pauseOnSwitch, setPauseOnSwitch] = useState(false);
//   const [shouldStart, setShouldStart] = useState(false);
//   const [defaultDuration, setDefaultDuration] = useState({
//     id: 25,
//     label: '25 minutes',
//   });
//   const [defaultBreak, setDefaultBreak] = useState({
//     id: 5,
//     label: '5 minutes',
//   });

//   const durations = [
//     { id: 1, label: '1 minutes' },
//     { id: 20, label: '20 minutes' },
//     { id: 25, label: '25 minutes' },
//     { id: 30, label: '30 minutes' },
//     { id: 45, label: '45 minutes' },
//     { id: 60, label: '60 minutes' },
//   ];

//   const breaks: Duration[] = useMemo(
//     () => [
//       { id: 1, label: '1 minutes' },
//       { id: 5, label: '5 minutes' },
//       { id: 10, label: '10 minutes' },
//       { id: 15, label: '15 minutes' },
//       { id: 30, label: '30 minutes' },
//     ],
//     []
//   );

//   useEffect(() => {
//     if (shouldStart) {
//       let timer: NodeJS.Timeout;

//       const tick = () => {
//         if (!isPaused) {
//           if (seconds === 0) {
//             if (minutes === 0) {
//               setIsWorking(!isWorking);
//               setPauseOnSwitch(true);
//               setMinutes(isWorking ? defaultDuration.id : defaultBreak.id);
//               setSeconds(0);
//             } else {
//               setMinutes((prev) => prev - 1);
//               setSeconds(59);
//             }
//           } else {
//             setSeconds((prev) => prev - 1);
//           }
//         }
//       };

//       timer = setInterval(tick, 1000);

//       return () => clearInterval(timer);
//     }
//   }, [
//     isWorking,
//     isPaused,
//     minutes,
//     seconds,
//     shouldStart,
//     defaultDuration,
//     defaultBreak,
//   ]);

//   const togglePlayPause = () => {
//     setIsPaused((prev) => !prev);
//     setShouldStart(true);
//   };

//   const handleDurationChange = (duration: Duration) => {
//     if (isWorking) {
//       setDefaultDuration(duration);
//     } else {
//       setMinutes(duration.id);
//       setSeconds(0);
//     }

//     setMinutes(duration.id);
//     setSeconds(0);
//   };

//   const handleBreakChange = (breakTime: Duration) => {
//     setDefaultBreak(breakTime);
//     if (isWorking) {
//       setDefaultBreak(breakTime);
//     } else {
//       setMinutes(breakTime.id);
//       setSeconds(0);
//     }
//     setSeconds(0);
//   };

//   const formatTime = (time: number) => (time < 10 ? `0${time}` : `${time}`);

//   const Icon = isPaused ? Play : Pause;

//   return (
//     <>
//       <div className="flex items-center gap-2 mr-auto pl-16 md:pl-0">
//         <div className="flex gap-x-2">
//           <p>
//             {formatTime(minutes)}:{formatTime(seconds)}
//           </p>
//           <button onClick={togglePlayPause}>
//             <Icon size={14} />
//           </button>
//         </div>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline">
//               <MoreHorizontal size={10} />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="w-56">
//             <DropdownMenuGroup>
//               <DropdownMenuSub>
//                 <DropdownMenuSubTrigger>
//                   <span>Duration</span>
//                 </DropdownMenuSubTrigger>
//                 <DropdownMenuPortal>
//                   <DropdownMenuSubContent>
//                     {durations.map((d) => (
//                       <DropdownMenuItem
//                         key={d.id}
//                         onClick={() => handleDurationChange(d)}
//                       >
//                         <span>{d.label}</span>
//                       </DropdownMenuItem>
//                     ))}
//                   </DropdownMenuSubContent>
//                 </DropdownMenuPortal>
//               </DropdownMenuSub>
//               <DropdownMenuSub>
//                 <DropdownMenuSubTrigger>
//                   <span>Break</span>
//                 </DropdownMenuSubTrigger>
//                 <DropdownMenuPortal>
//                   <DropdownMenuSubContent>
//                     {breaks.map((b) => (
//                       <DropdownMenuItem
//                         key={b.id}
//                         onClick={() => handleBreakChange(b)}
//                       >
//                         <span>{b.label}</span>
//                       </DropdownMenuItem>
//                     ))}
//                   </DropdownMenuSubContent>
//                 </DropdownMenuPortal>
//               </DropdownMenuSub>
//             </DropdownMenuGroup>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </>
//   );
// };

// export default PomodoroTimer;
