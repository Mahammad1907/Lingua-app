import { useLocalSearchParams } from 'expo-router';
import V2Supplement from '../../components/lesson/V2Supplement';
export default function SupplementRoute(){const {kind}=useLocalSearchParams<{kind:string}>();return <V2Supplement key={kind} kind={kind||'self-check'}/>;}
