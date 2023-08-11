<script setup lang='ts'>
import { ref } from 'vue'
import IwFormConfig, { IwFormType } from '~/components/Forms/IwForm/utils/IwFormConfig';

///////////////////////////////////////////////@  Import, Types & meta
//////////////////////////////////////////////////////////////////////


///////////////////////////////////////////@  Props, Emits & Variables
//////////////////////////////////////////////////////////////////////

let myForm = ref<IwFormConfig>()

myForm.value = new IwFormConfig(
    {
        formGroups: [
            {
                css: 'grid md:grid-cols-2',
                formInputs: [
                    {
                        type: IwFormType.TEXTGROUP_TEXT,
                        name: 'TotalSales',
                        foldable: true,
                        label: 'Payment Amount (Exact value e.g. 128.00)',
                        query: {
                            type: 'filter',
                            operator: 'eq',
                        }
                    },
                ]
            }
        ]
    }
);
</script>